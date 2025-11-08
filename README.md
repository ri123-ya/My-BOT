# RiyaBOT
**A full-stack RAG AI chat assistant** that answers **only from my resume** (`Resume.pdf`).  

## Features

- **Resume-Based Answers** – Upload `Resume.pdf`, ask anything from it  
- **RAG Pipeline** – LangChain + Qdrant for semantic retrieval  
- **Dual LLMs**  
  - **Grok SDK** → Final LLM response  
  - **Google Gemini** → Vector embeddings **and** decides **RAG vs Direct** query  
- **In-Memory Caching** – `node-cache` for faster repeated queries  
- **Modern UI** – React + Tailwind + Vite + **SessionStorage** for thread persistence  
- **Dockerized** – Full stack with `docker-compose`
  
## Tech Stack 
### Frontend
- React
- Vite
- Tailwindcss
- SessionStorage

### Backend
- Nodejs
- Express
- LangChain
- Qdrant
- Node-Cache
- Grok SDK
- Google-Genai

## How It Works:

### *1. First Visit (Welcome → Chat UI)*

User clicks "Let's Get Started"
→ ChatUI component loads
→ Generates threadId: "thread-1234567890-abc"
→ Saves to sessionStorage
→ Empty messages array


### *2. During Conversation*

User asks: "What projects?"
→ Sends with threadId to backend
→ Backend caches conversation
→ Message saved to sessionStorage
→ Page refresh: messages persist! 


### *3. Click "New Chat" Button*

→ Generates NEW threadId: "thread-9876543210-xyz"
→ Clears messages
→ Updates sessionStorage
→ Fresh conversation starts


### *4. Page Refresh*

→ Loads threadId from sessionStorage
→ Loads messages from sessionStorage
→ Conversation continues! 
