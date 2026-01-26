# RagXGen — Retrieval-Augmented Generation Explained by Building It

<div align="center">

![RagXGen](https://img.shields.io/badge/RagXGen-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

**A complete, production-quality implementation of Retrieval-Augmented Generation**

[Live Demo](#live-demo) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## 🎯 What is RagXGen?

RagXGen is a portfolio project that demonstrates deep understanding of Retrieval-Augmented Generation by:

1. **Explaining it** — Clear, engineer-friendly documentation of how RAG works
2. **Visualizing it** — Interactive pipeline diagrams showing each step
3. **Implementing it** — Real, working code with production patterns
4. **Evaluating it** — Honest discussion of trade-offs and failure modes

This isn't a mock demo. It's a fully functional RAG system you can test with your own documents.

---

## ✨ Features

- **📄 Document Upload** — Upload PDFs and TXT files for processing
- **🔍 Semantic Search** — FAISS-powered vector similarity search
- **💬 Chat Interface** — Natural language Q&A with your documents
- **📊 Transparency** — See retrieved chunks, similarity scores, and sources
- **⚙️ Configurable** — Adjust chunk size, overlap, and top-K retrieval
- **🎨 Modern UI** — Dark mode, smooth animations, responsive design

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Landing  │  │ What is  │  │Architect-│  │    Live Demo     │ │
│  │  Page    │  │   RAG?   │  │   ure    │  │  (Chat + Upload) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API
┌────────────────────────────┴────────────────────────────────────┐
│                         BACKEND (FastAPI)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      RAG Pipeline                           │ │
│  │  ┌─────────┐  ┌────────────┐  ┌────────┐  ┌─────────────┐  │ │
│  │  │ Document│→ │  Chunking  │→ │Embedding│→ │FAISS Store │  │ │
│  │  │ Upload  │  │(1000 char) │  │(OpenAI) │  │(Similarity)│  │ │
│  │  └─────────┘  └────────────┘  └────────┘  └─────────────┘  │ │
│  │                                                             │ │
│  │  ┌─────────┐  ┌────────────┐  ┌────────┐  ┌─────────────┐  │ │
│  │  │  Query  │→ │  Retrieve  │→ │ Augment│→ │  Generate   │  │ │
│  │  │ Input   │  │  Top-K (4) │  │ Prompt │  │(GPT-4o-mini)│  │ │
│  │  └─────────┘  └────────────┘  └────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Python** 3.10+
- **OpenAI API Key**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ragxgen.git
cd ragxgen
```

### 2. Set Up Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`. 
API documentation at `http://localhost:8000/docs`.

### 3. Set Up Frontend

```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create env file
cp .env.example .env.local

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
ragxgen/
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI application entry
│   │   ├── config.py             # Configuration management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py        # Pydantic models
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── documents.py      # Document upload endpoints
│   │   │   └── query.py          # RAG query endpoint
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── embeddings.py     # OpenAI embeddings service
│   │       ├── vector_store.py   # FAISS vector store
│   │       └── rag_pipeline.py   # Core RAG implementation
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── globals.css       # Global styles
│   │   │   ├── what-is-rag/
│   │   │   │   └── page.tsx      # What is RAG explanation
│   │   │   ├── architecture/
│   │   │   │   └── page.tsx      # Interactive architecture
│   │   │   ├── demo/
│   │   │   │   └── page.tsx      # Live RAG demo
│   │   │   ├── evaluation/
│   │   │   │   └── page.tsx      # Trade-offs & failure cases
│   │   │   └── about/
│   │   │       └── page.tsx      # Case study
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navigation.tsx
│   │   │       └── Footer.tsx
│   │   └── lib/
│   │       ├── api.ts            # API client
│   │       └── utils.ts          # Utility functions
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | (required) |
| `CHUNK_SIZE` | Characters per document chunk | `1000` |
| `CHUNK_OVERLAP` | Overlap between chunks | `200` |
| `TOP_K` | Default chunks to retrieve | `4` |
| `MODEL_NAME` | LLM model for generation | `gpt-4o-mini` |
| `EMBEDDING_MODEL` | Embedding model | `text-embedding-3-small` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 📚 API Endpoints

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/documents/upload` | Upload and process a document |
| `GET` | `/documents/session/{id}` | Get session information |
| `DELETE` | `/documents/session/{id}` | Delete a session |
| `POST` | `/documents/session/create` | Create new session |

### Query

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/query/` | Execute RAG query |
| `GET` | `/query/config` | Get RAG configuration |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |

---

## 🧠 How RAG Works

### The Problem
Traditional LLMs have three key limitations:
1. **Hallucinations** — They confidently make up information
2. **Stale Knowledge** — Training cutoff means outdated information
3. **No Source Attribution** — Can't verify where answers come from

### The Solution
RAG addresses these by retrieving relevant context from your documents:

```
User Question
     ↓
Embed question → Search vector store → Retrieve top-K chunks
     ↓
Inject chunks into prompt → Generate grounded answer
     ↓
Answer with sources
```

### Key Components

| Component | Purpose | This Project |
|-----------|---------|--------------|
| **Document Chunking** | Split docs into searchable pieces | RecursiveCharacterTextSplitter |
| **Embeddings** | Convert text to vectors | OpenAI text-embedding-3-small |
| **Vector Store** | Store and search vectors | FAISS (in-memory) |
| **Retrieval** | Find relevant chunks | Cosine similarity, Top-K |
| **Generation** | Produce final answer | GPT-4o-mini |

---

## ⚖️ Trade-offs & Limitations

### Chunk Size
- **Smaller (200-500)**: Higher precision, less context per chunk
- **Larger (1000-2000)**: More context, may include irrelevant info
- **Recommendation**: Start with 1000, adjust based on results

### Top-K Retrieval
- **Lower (1-2)**: Focused, but may miss relevant info
- **Higher (6-10)**: Comprehensive, but noisier
- **Recommendation**: Default to 4, adjust per use case

### Known Limitations
1. Session data is stored in memory (lost on restart)
2. No persistent storage of vector indices
3. Limited to PDF and TXT files
4. Single-turn conversations (no memory)

---

## 🔮 Production Improvements

If deploying to production, consider:

### Retrieval Quality
- [ ] Add reranking with cross-encoder
- [ ] Implement hybrid search (semantic + keyword)
- [ ] Use HyDE for better retrieval

### Scalability
- [ ] Use managed vector DB (Pinecone, Weaviate)
- [ ] Add Redis caching
- [ ] Implement connection pooling

### Reliability
- [ ] Add comprehensive error handling
- [ ] Implement retry with exponential backoff
- [ ] Set up monitoring and alerting

### User Experience
- [ ] Stream responses for faster perceived latency
- [ ] Add conversation history
- [ ] Support more file formats

---

## 🛠 Technology Choices

### Why LangChain?
- Mature ecosystem with good documentation
- Built-in text splitters optimized for RAG
- Easy integration with various LLMs and vector stores

### Why FAISS?
- No external dependencies (runs locally)
- Fast similarity search
- Good enough for demo/prototype scale

### Why FastAPI?
- High performance async Python
- Automatic OpenAPI documentation
- Excellent Pydantic integration

### Why Next.js App Router?
- Modern React patterns (Server Components)
- Built-in routing and layouts
- Great developer experience

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 🤝 Connect

Built by a software engineer passionate about AI/ML systems.

- **GitHub**: [github.com/pananon](https://github.com)
- **LinkedIn**: [linkedin.com/in/harimangalp](https://linkedin.com)
- **Email**: [contact@mangalcore.com](mailto:contact@mangalcore.com)
- **Website**: [mangalcore.com](https://mangalcore.com)

<div align="center">

**⭐ Star this repo if you found it helpful!**

</div>
