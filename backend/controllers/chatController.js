// controllers/chatController.js
import { similaritySearch } from "../services/vectorService.js";
import { askGroq } from "../services/llmService.js";
import { classifyQuery } from "../services/routerService.js";

export async function handleChat(req, res) {
  try {
    console.log("🔵 handleChat called");
    console.log("📥 Request body:", req.body);

    const { message, threadId } = req.body;
    if (!message) {
      console.log("❌ No message provided");
      return res.status(400).json({ error: "message is required" });
    }
    if (!threadId) {
      console.log("❌ No threadId provided");
      return res.status(400).json({ error: "threadId is required" });
    }
    console.log("🧵 Thread ID:", threadId);

    // --- NEW STEP 1: ROUTING ---
    console.log("🚦 Step 1: Classifying query for RAG or Direct...");
    const classification = await classifyQuery(message);
    console.log(`✅ Router decision: ${classification}`);

    let context = "";
    let chunks = [];

    if (classification === "RAG_QUERY") {
      // --- RAG PATH (Original Logic) ---

      console.log("🔍 Step 2: RAG Path -> Searching for similar documents...");
      chunks = await similaritySearch(message, 3);
      console.log(`✅ Found ${chunks.length} chunks`);

      console.log("🔍 Step 3: Building context...");
      context = chunks.map((c) => c.pageContent).join("\n\n");
      console.log(`✅ Context length: ${context.length} characters`);

      console.log("💬 Step 4: Calling Groq API with Context...");
    } else {
      // --- DIRECT LLM PATH (New, faster path) ---

      console.log(
        "💬 Step 2: Direct Path -> Skipping search. Calling Groq API without context..."
      );
      // Context remains an empty string, which the LLM service must handle gracefully.
    }

    console.log("🔍 Step 3: Calling Groq API...");
    const answer = await askGroq(message, context, threadId);
    console.log("✅ Got answer from Groq");

    const sources = chunks.map((doc, index) => ({
      chunkId: `chunk-${index}`,
      content: doc.pageContent,
      metadata: doc.metadata || {},
      preview: doc.pageContent.substring(0, 150) + "...",
    }));

    const responseData = {
      answer, // The bot's response text
      sources, // Array of source chunks for UI display
      usedRetrieval: classification === "RAG_QUERY", // Boolean: did we search?
      routeDecision: classification, // "RAG_QUERY" or "DIRECT_LLM"
      contextUsed: context, // Full context string (for debugging)
      metadata: {
        threadId,
        timestamp: new Date().toISOString(),
        sourceCount: sources.length,
        queryLength: message.length,
      },
    };

    console.log(" Response prepared:");
    console.log(`   Route: ${classification}`);
    console.log(`   Sources: ${sources.length} chunks`);
    console.log(`   Answer length: ${answer.length} characters\n`);

    res.json(responseData);
  } catch (err) {
    console.error("❌ ERROR in handleChat:");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
      answer: "I apologize, but I encountered an error. Please try again.", 
      sources: [],
      usedRetrieval: false,
      routeDecision: null,
    });
  }
}
