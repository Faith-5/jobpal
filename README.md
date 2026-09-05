# JobPal AI

JobPal AI is an AI-powered resume tailoring, ATS score analysis, and cover letter optimization platform.

## Architecture

- **`frontend/`**: Vite + React 19 + TypeScript + Tailwind CSS application.
- **`backend/`**: FastAPI (Python 3.12) backend with SQLite database, Groq LLM service, and ReportLab PDF engine.

---

## Quick Start

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server runs at `http://localhost:3000`.

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The FastAPI backend runs at `http://localhost:8000` (API documentation at `/docs`).

---

## Production Build

To produce an optimized production bundle of the frontend:
```bash
cd frontend
npm run build
```
