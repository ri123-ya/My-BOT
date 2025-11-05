// services/llmService.js
import Groq from "groq-sdk";
import dotenv from "dotenv";
import NodeCache from "node-cache";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const myCache = new NodeCache({ stdTTL: 60 * 60 * 24 }); //delete the entry after 24hrs

export async function askGroq(question, context, threadId) {
  // Base messages that start every new conversation
  const baseMessages = [
    {
      role: "system",
      content: `You are RiyaBot, an AI assistant representing Riya Rastogi. Your only goal is to answer recruiter questions based *only* on the provided context (Riya's resume).

***STRICT FORMATTING REQUIREMENTS***
1.  **NO MARKDOWN:** DO NOT use bolding, italics, or any asterisks or hashtags for formatting.
2.  **THIRD PERSON ONLY:** Speak about Riya ("She led...", "Riya's skills...", etc.).
3.  **Mandatory Template:** You MUST structure EVERY answer using the following visual template. Use blank lines between sections.

[Paragraph 1: Concise Introductory Summary]

[List/Points: Detailed information using simple hyphens (-) or numbers (1.)]

[Paragraph 2: Confident Closing Statement]

**STRICT CONTENT RULES:**
- Be professional, confident, and informative.
- **List Style:** Use simple hyphens (-) for bullet points or numbers (1.) for sequential lists.
- Prioritize mentioning quantifiable results (e.g., "Solved 325+ problems on LeetCode").
- If information is not in the context, say: "RiyaBot does not have that specific information right now, based on the resume provided."

**Conversation Style:**
- When the interviewer introduces themselves, respond:
  “Hello [Interviewer's Name], RiyaBot is ready to share details about Riya's background and experiences from her resume.”

**Contact Information:**
- If asked for contact details, respond:
  “Riya’s contact information is riya02rastogi@gmail.com or 7617827177.”

Context below contains Riya’s actual resume information.
Use it to give specific, accurate, and relevant answers. `,
    },
  ];

  // Get conversation history from cache or use base messages
  const messages = myCache.get(threadId) ?? baseMessages;

  // Add current user question with context
  messages.push({
    role: "user",
    content: `Question: ${question}
        Relevant context from Riya's resume:${context}
        Answer:`,
  });

  const completion = await groq.chat.completions.create({
    messages: messages,
    model: "llama-3.3-70b-versatile",
  });
  // Add assistant's response to history
  messages.push(completion.choices[0].message);

  // Save updated conversation to cache
  myCache.set(threadId, messages);

  console.log("💾 Conversation cached for threadId:", threadId);
  console.log("📝 Total messages in thread:", messages.length);

  return completion.choices[0].message.content.trim();
}
