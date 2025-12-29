Pastebin-Lite

Pastebin-Lite is a lightweight web application that allows users to create and share text pastes via a public URL. Each paste can optionally include constraints such as a time-to-live (TTL) or a maximum number of views, after which the paste becomes unavailable. The project is designed to be simple, reliable, and compatible with automated testing environments.

Features

Create & Share Pastes
Users can create text-based pastes and receive a unique, shareable URL.

Optional Constraints
Pastes may include a time-based expiration (TTL) and/or a maximum view count. A paste becomes unavailable once any constraint is triggered.

Persistent Storage
All pastes are stored using a persistent database, ensuring data survives restarts and serverless deployments.

Deterministic Expiry Testing
Supports deterministic time-based testing using request headers, enabling reliable automated grading.

Health Check Endpoint
Provides an API endpoint to verify application and database availability.

Tech Stack

Frontend: React (deployed on Vercel)

Backend: Node.js with Express (deployed on Render)

Database: MongoDB Atlas

Running the Project Locally
1. Clone the Repository
git clone <your-repo-url>

2. Backend Setup
cd backend
npm install


Create a .env file in the backend directory with the following values:

PORT=5000
MONGO_URI=your_mongo_connection_string
NODE_ENV=development


Start the backend server:

npm start


The backend will run on http://localhost:5000.

3. Frontend Setup
cd frontend
npm install
npm start


The frontend will be available at:

http://localhost:3000

Persistence Layer

This application uses MongoDB Atlas as its persistence layer. MongoDB was chosen to ensure data reliability, durability across requests, and compatibility with serverless deployment environments where in-memory storage is insufficient.

Health Check

Endpoint: GET /api/healthz

Response:
Returns HTTP 200 with JSON:

{ "ok": true }


Confirms that both the application and database are reachable.

Design Decisions

Frontend and backend are deployed separately to allow independent scaling and simpler deployments.

MongoDB was selected for persistence to meet automated testing and serverless requirements.

Deterministic expiry testing was implemented using request headers to support reliable automated evaluation.

The repository contains no hardcoded localhost URLs, secrets, or credentials.

Author

Tarushi Chaudhary