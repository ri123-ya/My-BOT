import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const filePath = "./data/Riya_Rastogi_SDE_25.pdf";

export async function indexTheDocument(filePath){
    const loader = new PDFLoader(filePath);
    const doc = await loader.load();
    console.log("Document Loaded: ", doc);
}

indexTheDocument(filePath);