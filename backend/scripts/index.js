import { indexTheDocument } from "../utils/prepare.js";
import dotenv from "dotenv";
dotenv.config();

const filePath = "./data/Riya_Resume.pdf";

console.log("Starting indexing...");

indexTheDocument(filePath)
  .then(() => {
    console.log("Done! PDF is now in Qdrant.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed:", err.message);
    process.exit(1);
  });
