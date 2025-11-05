import { similaritySearch } from "../services/vectorService.js";
import { askGroq } from "../services/llmService.js";
import { classifyQuery } from "../services/routerService.js";

export async function handleChat(req, res) {
  try {
    const { message, threadId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }
    if (!threadId) {
      return res.status(400).json({ error: "threadId is required" });
    }

    // classify the user query  as RAG or DIRECT 
    const classification = await classifyQuery(message);

    let context = "";
    let chunks = [];

    if (classification === "RAG_QUERY") {
      chunks = await similaritySearch(message, 3);
      context = chunks.map((c) => c.pageContent).join("\n\n");
    } 
    //else call direct LLM 
    const answer = await askGroq(message, context, threadId);
    
    //Prepare the response for frontend
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
    res.json(responseData);
  } catch (err) {
    console.error("ERROR in handleChat:");
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
