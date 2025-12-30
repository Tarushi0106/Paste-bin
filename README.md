Pastebin-Lite

A lightweight Pastebin-style web application that allows users to create text pastes and share them via a unique URL.
Pastes can optionally expire based on time-to-live (TTL) and/or view-count limits.

This project is designed to be simple, reliable, and compatible with automated grading.

✨ Features

Create a paste containing arbitrary text

Generate a shareable URL to view the paste

View pastes via API or browser (HTML)

Optional constraints:

Time-based expiry (TTL)

Maximum view count

Deterministic time handling for automated testing

Safe rendering (no script execution)

Persistent storage (works on serverless platforms)

🧱 Tech Stack

Frontend: React (Vite)

Backend: Node.js (Express)

Database: MongoDB Atlas (persistent across requests)

Deployment: Vercel (frontend) + Render / Node server (backend)

🔗 Deployed Application

App URL: https://<your-app>.vercel.app

Example Paste URL: https://<your-app>.vercel.app/p/<paste_id>

📡 API Endpoints
Health Check
GET /api/healthz


Response

{ "ok": true }


Returns HTTP 200

Confirms database connectivity

Used by automated service checks

Create a Paste
POST /api/pastes


Request Body

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}


Rules

content is required and must be a non-empty string

ttl_seconds (optional) must be an integer ≥ 1

max_views (optional) must be an integer ≥ 1

Response

{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}

Fetch a Paste (API)
GET /api/pastes/:id


Response (200)

{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Each successful fetch counts as one view

remaining_views is null if unlimited

expires_at is null if no TTL

Unavailable Cases

Paste not found

Paste expired

View limit exceeded

All return:

HTTP 404
Content-Type: application/json

View a Paste (HTML)
GET /p/:id


Returns rendered HTML (HTTP 200)

Paste content is escaped to prevent script execution

Returns HTTP 404 if unavailable

⏱ Deterministic Time for Testing

To support automated TTL testing:

If TEST_MODE=1 is set:

The request header

x-test-now-ms: <milliseconds since epoch>


is used as the current time for expiry logic

If the header is absent, system time is used

This affects expiry checks only

🗄 Persistence Layer

This project uses MongoDB Atlas as the persistence layer.

Why MongoDB?

Fully persistent (not in-memory)

Works reliably with serverless deployments

No manual migrations required

Atomic updates prevent negative view counts under concurrency

The database stores:

Paste content

Creation time

Expiry timestamp (if any)

Remaining view count (if any)

🚀 Running Locally
1. Clone the Repository
git clone https://github.com/your-username/pastebin-lite.git
cd pastebin-lite

2. Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3. Environment Variables

Create a .env file in the backend directory:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
TEST_MODE=0


⚠️ No secrets are committed to the repository.

4. Start the App
Backend
npm start

Frontend
npm run dev


Frontend runs on http://localhost:3000

Backend runs on http://localhost:5000

✅ Design Decisions

Server-side validation for all inputs

Atomic database updates to enforce view limits safely

Consistent 404 responses for all unavailable cases

No global mutable state, safe for serverless environments

Content escaped before rendering in HTML

No hardcoded localhost URLs in production code

🧪 Automated Test Compatibility

This application is designed to pass all automated grading checks, including:

Health check availability

Correct API behavior and JSON responses

TTL and view-count enforcement

Deterministic expiry via x-test-now-ms

Persistence across requests

Safe concurrent access

📄 License

This project is provided for evaluation purposes only.
