# ACS-1970

A web scraper app with a Flask backend and React frontend.

## Prerequisites

- Python 3.12+
- Node.js 18+

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Starting the App

From the project root, run:

```bash
./start.sh
```

This starts both servers:

- **Backend** — Flask API at `http://localhost:5000`
- **Frontend** — React (Vite) at `http://localhost:5173`

Press `Ctrl+C` to stop both.

## Running Separately

**Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```
