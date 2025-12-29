Pastebin-Lite

A lightweight application to create and share text pastes with optional expiration and view-limit constraints.

Features

Create & Share: Users can create a text paste and receive a shareable URL.

Optional Constraints: Each paste can have a time-to-live (TTL) or a maximum view count.

Persistent Storage: Uses MongoDB for data persistence.

Deterministic Testing: Support for testing expiration via request headers.

Health Check: API endpoint to check the service and database status.

Tech Stack

Frontend: React (deployed on Vercel)

Backend: Node.js with Express (deployed on Render)

Database: MongoDB (Atlas)

Running Locally

Clone the repo:

git clone your-repo-url


Backend Setup:

cd backend
npm install


Create a .env file with:

PORT=5000
MONGO_URI=your_mongo_connection_string
NODE_ENV=development


Start the backend:

npm start


Frontend Setup:

cd frontend
npm install
npm start


The frontend will run on http://localhost:3000.

Persistence Layer

We use MongoDB Atlas as the persistence layer to ensure data is stored reliably and survives across serverless deployments.

Health Check

Endpoint: GET /api/healthz

Returns HTTP 200 with JSON { "ok": true } if the service and database are up.

Design Decisions

Deployed frontend and backend separately for scalability.

Added deterministic testing for TTL using request headers.

Ensured no hardcoded localhost URLs are in the committed code.

Author

Created by Tarushi Chaudhary