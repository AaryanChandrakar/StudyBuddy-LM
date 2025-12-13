import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embeddings.service.js";

const qdrantConfig = {
  url: `http://${process.env.QDRANT_HOST || "localhost"}:${
    process.env.QDRANT_PORT || 6333
  }`,
  apiKey: process.env.QDRANT_API_KEY || undefined,
};

const addDocuments = async (contentId, textChunks, metadata = {}) => {
  try {
    const collectionName = `content_${contentId}`;

    // Create documents with metadata
    const documents = textChunks.map((text, index) => ({
      pageContent: text,
      metadata: {
        contentId,
        chunkIndex: index,
        ...metadata,
      },
    }));

    // Create vector store and add documents (collection created automatically)
    const vectorStore = await QdrantVectorStore.fromDocuments(
      documents,
      embeddings,
      {
        ...qdrantConfig,
        collectionName,
      }
    );

    return {
      collectionName,
      chunkCount: textChunks.length,
      vectorStore,
    };
  } catch (error) {
    throw new Error(`Error adding documents to Qdrant: ${error.message}`);
  }
};

// Search similar documents
const searchSimilar = async (contentId, query, limit = 5) => {
  try {
    const collectionName = `content_${contentId}`;

    // Connect to existing vector store
    const vectorStore = new QdrantVectorStore(embeddings, {
      ...qdrantConfig,
      collectionName,
    });

    // Search for similar documents
    const results = await vectorStore.similaritySearchWithScore(query, limit);

    return results.map(([doc, score]) => ({
      content: doc.pageContent,
      score: score,
      metadata: doc.metadata,
    }));
  } catch (error) {
    throw new Error(`Error searching documents: ${error.message}`);
  }
};

// Search across multiple collections (for multiple content sources)
const searchMultipleSources = async (contentIds, query, limit = 10) => {
  try {
    const allResults = [];

    // Search each content collection
    for (const contentId of contentIds) {
      try {
        const results = await searchSimilar(contentId, query, limit);
        allResults.push(...results);
      } catch (error) {
        console.log(`No results from content ${contentId}: ${error.message}`);
      }
    }

    // Sort by score (higher is better for cosine similarity)
    allResults.sort((a, b) => b.score - a.score);

    // Return top results
    return allResults.slice(0, limit);
  } catch (error) {
    throw new Error(`Error searching multiple sources: ${error.message}`);
  }
};

// Delete collection
const deleteCollection = async (contentId) => {
  try {
    const collectionName = `content_${contentId}`;

    const response = await fetch(
      `${qdrantConfig.url}/collections/${collectionName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(qdrantConfig.apiKey && { "api-key": qdrantConfig.apiKey }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete collection: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.log(`Error deleting collection: ${error.message}`);
    return false;
  }
};

export { addDocuments, searchSimilar, searchMultipleSources, deleteCollection };
