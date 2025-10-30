import dotenv from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";

dotenv.config();

let vectorStore = null;

export async function initVectorStore() {
  if (vectorStore) return vectorStore;

  const embeddingModel = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY, // if required
  });

  vectorStore = await QdrantVectorStore.fromExistingCollection(embeddingModel, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: "My-Bot",
  });

  console.log("✅ Connected to Qdrant vector store");
  return vectorStore;
}

/**
 * Search top K similar chunks for a query
 * returns array of documents (with pageContent)
 */
export async function similaritySearch(query, k = 3) {
  const store = await initVectorStore();
  const results = await store.similaritySearch(query, k);
  return results;
}
