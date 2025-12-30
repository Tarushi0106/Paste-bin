# Pastebin-Lite

A lightweight Pastebin-style web application that lets users create text pastes and share them via a unique URL.  
Pastes can optionally expire based on time (TTL) and/or view-count limits.

This project is designed to be simple, reliable, and compatible with automated grading.

---

## Features

- Create a paste containing arbitrary text  
- Generate a shareable URL  
- View pastes via API or browser (HTML)  
- Optional constraints:
  - Time-based expiry (TTL)
  - Maximum view count  
- Deterministic time handling for automated testing  
- Safe rendering (no script execution)

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** MongoDB Atlas
- **Deployment:** Vercel

---

## Deployed App

- **App URL:** https://your-app.vercel.app  
- **Paste URL format:** https://your-app.vercel.app/p/:id  

---

## Persistence Layer

MongoDB Atlas is used to persist pastes.  
This ensures data survives across requests and works correctly in serverless environments.

---

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/paste-bin.git
cd paste-bin
2. Install dependencies
bash
Copy code
cd backend && npm install
cd ../frontend && npm install
3. Environment variables (backend)
Create a .env file:

env
Copy code
PORT=5000
MONGODB_URI=your_mongodb_connection_string
TEST_MODE=0
4. Start the application
bash
Copy code
# backend
npm start

# frontend
npm run dev
Notes
Pastes return 404 once expired or view limits are exceeded

View counts are enforced safely to avoid negative values

When TEST_MODE=1, the x-test-now-ms header is used for TTL checks

No secrets or hardcoded localhost URLs are committed
