Pastebin-Lite

A simple Pastebin-like app where users can create text pastes and share them via a link.
Pastes can expire based on time (TTL) and/or a maximum number of views.

This project is built to be reliable, minimal, and compatible with automated evaluation.

Features

Create a text paste

Get a shareable URL

View pastes via API or browser

Optional expiry:

Time-to-live (TTL)

View-count limit

Safe rendering (no script execution)

Deterministic time support for testing

Tech Stack

Frontend: React (Vite)

Backend: Node.js (Express)

Database: MongoDB Atlas

Deployment: Vercel (frontend) + Node backend

Deployed App

URL: https://your-app.vercel.app

Paste URL format: https://your-app.vercel.app/p/:id

Persistence

MongoDB Atlas is used to persist pastes.
This ensures data survives across requests and works correctly in serverless environments.

Running Locally
1. Clone the repo
git clone https://github.com/your-username/pastebin-lite.git
cd pastebin-lite

2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

3. Environment variables (backend)

Create a .env file:

PORT=5000
MONGODB_URI=your_mongodb_uri
TEST_MODE=0

4. Start the app
# backend
npm start

# frontend
npm run dev

Notes

View counts are enforced atomically to avoid negative values

Pastes return 404 once expired or view limit is exceeded

When TEST_MODE=1 is set, the x-test-now-ms header is used for TTL checks

No hardcoded localhost URLs or secrets are committed
