// services/llmService.js
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function askGroq(question, context) {
  const SYSTEM_PROMPT = `You are **RizaBot**, an AI assistant that represents Riza during interviews about her resume.
Your goal is to answer interview-style questions about Riza's background, education, experience, and skills.

Use the provided context (from her resume or documents) to answer accurately and naturally — as if Riza were speaking herself.

If you don't know the answer or the information isn't in the context, respond politely:
"Please contact Riza at 1234567890 or abc@gmail.com for more details." `;

  const userPrompt = `
Question: ${question}
Relevant context:
${context}

Answer:
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return completion.choices[0].message.content.trim();
}
