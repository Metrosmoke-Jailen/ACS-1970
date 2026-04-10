#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Activate venv and start Flask backend
echo "Starting backend..."
cd "$BACKEND_DIR"
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Start React frontend
echo "Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo "Backend running on http://localhost:5000 (PID $BACKEND_PID)"
echo "Frontend running on http://localhost:5173 (PID $FRONTEND_PID)"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait and clean up on exit
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT INT TERM
wait
