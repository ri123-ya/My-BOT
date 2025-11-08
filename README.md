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

## RAG Pipline

#### Stage 1. Indexing
- Upload the document (eg - pdf, text) 
  `npm i @langchain/community @langchain/core pdf-parse`
  → https://js.langchain.com/docs/integrations/document_loaders/file_loaders/pdf/
- Chunk the document 
   `npm i @langchain/textsplitters`
   `import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";`
   → https://js.langchain.com/docs/concepts/text_splitters/
- generate vector embedding
  `import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";`
  → https://ai.google.dev/gemini-api/docs/embeddings
- store the vector embedding - Vector db
   `import { QdrantVectorStore } from "@langchain/qdrant";`
   → https://cloud.qdrant.io/

#### Stage 2. Retrival
### RAG Flo### RAG Flow (Simplified & Accurate)

### RAG Flow (Clean & Simple)
### RAG Flow

```mermaid
flowchart TD
    A["User Query"] --> B["Gemini\n(RAG vs Direct Decision)"]

    B --> C{"RAG or Direct?"}

    C -- Direct --> D["Grok LLM"]
    D --> E["Answer\n(to Frontend)"]

    C -- RAG --> F["Gemini\nVector Embedding"]
    F --> G["Qdrant\nSimilarity Search"]
    G --> H["Relevant Resume\nChunks\n(with source metadata)"]
    H --> I["Grok LLM\n(with context)"]
    I --> J["Answer + Source\n(to Frontend)"]
