import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";

dotenv.config();

const filePath = "./data/Riya_Rastogi_SDE_25.pdf";

export async function indexTheDocument(filePath) {
  //Load the Pdf
  console.log("🔄 Loading PDF...");
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();
  const content = doc[0].pageContent;

  // console.log("Document Loaded: ", doc[0].pageContent);

  //Chunking
  // const textsplitters = new RecursiveCharacterTextSplitter({
  //     chunkSize:700,
  //     chunkOverlap:200,
  // });
  // const chunks = await textsplitters.splitText(doc[0].pageContent);
  // console.log("Chunks : ", chunks);
  // Split by major sections
  const sections = {
    contact: extractSection(content, "Riya Rastogi", "Education"),
    education: extractSection(content, "Education", "Projects"),
    projects: extractSection(content, "Projects", "Technical Skills"),
    skills: extractSection(content, "Technical Skills", "Competitions"),
    achievements: extractSection(content, "Competitions", "Experience"),
    experience: extractSection(content, "Experience", null),
  };

  // Create chunks with metadata
  const chunks = Object.entries(sections).map(([section, text]) => ({
   pageContent: text,
    metadata: { section, source: "resume" },
  }));

//   console.log("Semantic chunks:", chunks);


  //Make Embeddings
  const embeddingModel = new GoogleGenerativeAIEmbeddings({
     modelName: "text-embedding-004",
  });

  //Store in Vector DB
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
  console.log(`📊 Collection: "company-bot" contains ${chunks.length} vectors`);
  
  return vectorStore;
}

indexTheDocument(filePath);

function extractSection(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = endMarker ? text.indexOf(endMarker) : text.length;
  return text.substring(start, end).trim();
}
