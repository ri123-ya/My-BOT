// controllers/chatController.js
import { similaritySearch } from "../services/vectorService.js";
import { askGroq } from "../services/llmService.js";

export async function handleChat(req, res) {
  try {
    console.log("🔵 handleChat called");
    console.log("📥 Request body:", req.body);

    const { message } = req.body;
    if (!message) {
      console.log("❌ No message provided");
      return res.status(400).json({ error: "message is required" });
    }
    const steps = [];
    console.log("🔍 Step 1: Searching for similar documents...");
    steps.push(" Searching for similar documents...");
    const chunks = await similaritySearch(message, 3);
    console.log(`✅ Found ${chunks.length} chunks`);

    console.log("🔍 Step 2: Building context...");
    const context = chunks.map((c) => c.pageContent).join("\n\n");
    console.log(`✅ Context length: ${context.length} characters`);

    console.log("🔍 Step 3: Calling Groq API...");
    steps.push("  Calling Groq API...");
    const answer = await askGroq(message, context);
    console.log("✅ Got answer from Groq");

    res.json({
      answer,
      steps, 
      contextUsed: context
   });
  } catch (err) {
    console.error("❌ ERROR in handleChat:");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
}
