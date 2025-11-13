import { OpenAIEmbeddings } from "@langchain/openai";
import { splitTextIntoChunks } from "./document.processor.service.js";
import { addDocuments } from "./qdrant.service.js";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-large",
});

const processAndEmbed = async (contentId, text, metadata = {}) => {
  try {
    const chunks = await splitTextIntoChunks(text);

    if (chunks.length === 0) {
      throw new Error("No chunks created from text");
    }

    // Add documents to Qdrant (create embeddings automatically)
    const result = await addDocuments(contentId, chunks, metadata);

    // Calculate token usage for embeddings (rough estimate: 4 chars per token)
    const totalTokens = estimateTokens(text);

    return {
      collectionName: result.collectionName,
      chunkCount: result.chunkCount,
      tokensUsed: totalTokens,
    };
  } catch (error) {
    throw new Error(`Error processing and embedding text: ${error.message}`);
  }
};

const estimateTokens = (text) => {
  // Rough estimate: ~4 characters per token for English text
  const charsPerToken = parseInt(process.env.CHARACTERS_PER_TOKEN) || 4;
  return Math.ceil(text.length / charsPerToken);
};

// Calculate credits needed (1000 tokens = 1 credit)
const calculateCredits = (tokens) => {
  const tokensPerCredit = parseInt(process.env.TOKENS_PER_CREDIT) || 1000;
  return tokens / tokensPerCredit;
};

export { processAndEmbed, estimateTokens, calculateCredits, embeddings };
