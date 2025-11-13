import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { searchMultipleSources } from "./qdrant.service.js";
import { estimateTokens } from "./embeddings.service.js";

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4.1",
  temperature: 0.1,
});

const ragPromptTemplate = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context.

Context from documents:
{context}

Question: {question}

Instructions:
1. Answer the question based ONLY on the provided context
2. If the context doesn't contain enough information, say "I don't have enough information in the provided documents to answer this question"
3. Be specific and cite relevant parts of the context
4. Keep your answer clear and concise
5. If you mention specific information, indicate which document or source it came from

Answer:
`);

const processQuery = async (query, selectedContentIds) => {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error("Query is required");
    }

    if (!selectedContentIds || selectedContentIds.length === 0) {
      throw new Error("At least one content source must be selected");
    }

    // Search for relevant content across selected sources
    const searchResults = await searchMultipleSources(
      selectedContentIds,
      query,
      5
    );

    if (searchResults.length === 0) {
      return {
        response:
          "I couldn't find any relevant information in your selected documents to answer this question. Try rephrasing your question or selecting different documents.",
        citations: [],
        tokensUsed: { input: 0, output: 0, total: 0 },
      };
    }

    // Build context from search results
    const contextParts = searchResults.map((result, index) => {
      return `Document ${index + 1} (Score: ${result.score.toFixed(2)}):
${result.content}

---`;
    });

    const context = contextParts.join("\n");

    // Create the prompt
    const prompt = await ragPromptTemplate.format({
      context: context,
      question: query,
    });

    // Estimate tokens for input
    const inputTokens = estimateTokens(prompt);

    // Generate response
    const response = await llm.invoke(prompt);
    const responseText = response.content;

    // Estimate tokens for output
    const outputTokens = estimateTokens(responseText);
    const totalTokens = inputTokens + outputTokens;

    // Create citations from search results
    const citations = searchResults.map((result, index) => ({
      contentId: result.metadata.contentId,
      chunkIndex: result.metadata.chunkIndex,
      title: result.metadata.title || `Document ${index + 1}`,
      sourceType: result.metadata.sourceType || "unknown",
      content:
        result.content.substring(0, 200) +
        (result.content.length > 200 ? "..." : ""),
      relevanceScore: result.score,
    }));

    return {
      response: responseText,
      citations: citations,
      tokensUsed: {
        input: inputTokens,
        output: outputTokens,
        total: totalTokens,
      },
    };
  } catch (error) {
    throw new Error(`Error processing query: ${error.message}`);
  }
};

export { processQuery };
