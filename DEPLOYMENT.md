# JobPal deployment guide

## 1) GitHub repo setup

Create a new GitHub repository in the browser, then run:

```bash
git remote add origin https://github.com/<your-username>/jobpal.git
git branch -M main
git push -u origin main
```

## 2) Frontend deployment on Vercel

### Recommended method

- Import the repo into Vercel
- Set the project root to `frontend`
- Use the following build settings:
  - Framework: `Vite`
  - Build command: `npm run build`
  - Output directory: `dist`

### Environment variable

Add this in Vercel:

```bash
VITE_API_URL=https://your-backend-url.com
```

## 3) Backend deployment

The FastAPI backend is not a good fit for a default Vercel deployment. Deploy it to a Python host such as:

- Render
- Railway
- Fly.io
- Supabase + custom backend

### Example Render settings

- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

### Environment variables

```bash
DATABASE_URL=sqlite:///./jobpal.db
SECRET_KEY=your-secret-key
GROQ_API_KEY=your-groq-key
BACKEND_CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

## 4) Demo links

After deployment, add links like:

- GitHub: `https://github.com/<your-username>/jobpal`
- Demo: `https://jobpal-demo.vercel.app`
- API: `https://jobpal-api.onrender.com`

## 5) Local development

```bash
cd frontend
npm install
npm run dev

cd ../backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```
