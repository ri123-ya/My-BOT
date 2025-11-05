import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

const filePath = "./data/Resume.pdf";

export async function indexTheDocument(filePath) {
  //Load the Pdf
  console.log("🔄 Loading PDF...");
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();
  console.log("✅ PDF loaded");

  console.log("Document Loaded: ", doc[0].pageContent);

  //Chunking
  const textsplitters = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 200,
    separators: ["\n\n", "\n", " ", ""]
  });
  const chunks = await textsplitters.splitDocuments(doc);
  console.log("Chunks : ", chunks);

  
  console.log("🔄 Chunking document...");
  console.log(`✅ Created ${chunks.length} chunks`);

  // Make Embeddings
  console.log("🔄 Initializing embedding model...");
  const embeddingModel = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
  });

  //Store in Vector DB
  console.log("🔄 Creating embeddings and storing in Qdrant...");
  const vectorStore = await QdrantVectorStore.fromDocuments(
    chunks,
    embeddingModel,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "My-Bot",
    }
  );
  console.log("✅ All vectors stored in Qdrant successfully!");
  console.log(`📊 Collection: "My-Bot" contains ${chunks.length} vectors`);

  return vectorStore;
}

indexTheDocument(filePath);
