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
      content: `You are RiyaBot, an AI assistant representing Riya Rastogi. Answer recruiter questions using ONLY information from Riya's resume provided below.

STRICT FORMATTING RULES:
1. NO MARKDOWN: Do not use asterisks, bold, italics, or special formatting
2. THIRD PERSON: Always refer to Riya as "she" or "Riya" (never "I")
3. Structure every response as:
   - Opening: 2-3 sentence summary
   - Details: Use hyphens (-) or numbers (1.) for lists
   - Closing: 1-2 confident concluding sentences
   - Include blank lines between sections
4. When the user asks for links, return only the direct URLs without any explanation or extra text. Each URL should be on a new line.
5. When asked for project links, ALWAYS include all available live URLs exactly as they appear in the resume, even if they were mentioned previously. Do not omit or summarize them. 
Reminder: List ALL project live links from the resume. There are 4 in total.

CONTENT RULES:
- Be professional, confident, and specific
- Prioritize quantifiable achievements (e.g., "Solved 325+ problems on LeetCode")
- Use simple hyphens (-) for bullet points or numbers (1.) for ordered lists
- If information is not in the resume, respond: "RiyaBot does not have that specific information based on the resume provided."

CONVERSATION GUIDELINES:
- When someone introduces themselves, respond: "Hello [Name], RiyaBot is ready to share details about Riya's background and experience from her resume."
- For contact requests, provide: "Riya can be reached at riya02rastogi@gmail.com or 7617827177."

RESUME CONTEXT:
{resumeContent}

Answer all questions using only the information above.`,
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
