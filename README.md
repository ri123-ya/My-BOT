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

```mermaid
flowchart TD
    %% === Input ===
    A[User Message + threadId] --> B[Backend: /api/chat]

    %% === Cache Check ===
    B --> C{node-cache<br/>Hit for threadId?}
    C -- Yes --> D[Return cached response]
    D --> Z[Stream to Frontend]

    %% === Router Service (Gemini) ===
    C -- No --> E[routerService.js<br/>(Google Gemini)]
    E --> F{Is it a RAG query?}

    %% === Direct Path ===
    F -- No --> G[Direct → Grok LLM]
    G --> H[Generate response]
    H --> I[Store in node-cache<br/>(key: threadId)]

    %% === RAG Path ===
    F -- Yes --> J[Gemini → Vector Embedding]
    J --> K[Qdrant Similarity Search]
    K --> L[Retrieve Top-K Resume Chunks]
    L --> M[Prompt = User Query + Chunks]
    M --> N[Grok LLM → Final Answer]
    N --> I

    %% === Output ===
    I --> Z

    %% === Styling ===
    classDef input fill:#e0f2fe,stroke:#0ea5e9,stroke-width:2px;
    classDef cache fill:#fef3c7,stroke:#f59e0b,stroke-width:2px;
    classDef router fill:#f0fdf4,stroke:#22c55e,stroke-width:2px;
    classDef rag fill:#f0f0ff,stroke:#6366f1,stroke-width:2px;
    classDef llm fill:#faf5ff,stroke:#a855f7,stroke-width:2px;
    classDef output fill:#ecfdf5,stroke:#16a34a,stroke-width:2px;

    class A input
    class C cache
    class E router
    class J,K,L rag
    class G,N llm
    class Z output
