import dotenv from "dotenv";
dotenv.config();


// ✅ Use environment variable instead of hardcoding
const apiKey = process.env.GOOGLE_API_KEY;
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

/**
 * System Instruction for the Router LLM.
 */
const ROUTER_SYSTEM_PROMPT = `You are a strict query classification engine for a resume chatbot.
Your task is to determine if the user's question requires information from Riya's resume or can be answered directly.

If the question is:
- Asking about Riya's projects, skills, education, or experience
- Requesting specific details from her resume
- Technical abilities or achievements
- Contact information from resume
- Work history or qualifications
Return ONLY the keyword 'RAG_QUERY'.

If the question is:
- A simple greeting ('hi', 'hello', 'how are you')
- General conversation not requiring resume data
- Questions about the bot itself
- Casual chat or jokes
Return ONLY the keyword 'DIRECT_LLM'.

Respond with ONLY one of these two keywords, nothing else.`;

/**
 * Classifies the user query as RAG_QUERY or DIRECT_LLM using Gemini.
 * @param {string} query The user's message.
 * @returns {Promise<string>} 'RAG_QUERY' or 'DIRECT_LLM'
 */
export async function classifyQuery(query) {
  // ✅ Validate API key
  if (!apiKey) {
    console.error("GOOGLE_API_KEY not found in environment variables");
    return "RAG_QUERY"; // Safe fallback
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: {
        parts: [{ text: ROUTER_SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      .toUpperCase();

    console.log(`   Raw response: "${text}"`);

    //Validate response
    if (text === "RAG_QUERY" || text === "DIRECT_LLM") {
      return text;
    } else {
      console.warn(`Unexpected output: "${text}", defaulting to RAG_QUERY`);
      return "RAG_QUERY";
    }
  } catch (error) {
    console.error(" Error classifying query:", error.message);
    // Safe fallback: Always default to RAG on error
    return "RAG_QUERY";
  }
}