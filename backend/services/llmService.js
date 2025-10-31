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
      content: `You are RiyaBot, an AI assistant that represents Riya during interviews about her resume.
          Your goal is to answer interview-style questions about Riya's background, education, experience, and skills.

          Use the provided context (from her resume or documents) to answer accurately and naturally — as if Riya were speaking herself.
          Answer in paragraph form or points, being concise yet informative and professional.

          If you don't know the answer or the information isn't in the context, respond politely:
          "Please contact Riya at riya02rastogi@gmail.com or 7617827177 for more details."

          Current date and time: ${new Date().toUTCString()}`,
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
