# Personal Finance Dashboard

Personal Finance Dashboard is a full-stack app that lets you log income and expenses, view running balances, and see live USD to EUR and INR exchange rates. Google OAuth provides a simple login flow, while MongoDB stores each user's transactions.

## Architecture

- Frontend: React (Vite), React Router, SWR for data fetching, Bootstrap for layout/styling, Google OAuth for login.
- Backend: Express API with CORS and JSON parsing, routes for transactions and rates, serves the production React build.
- Database: MongoDB via Mongoose with a `Transaction` model.
- External API: Frankfurter currency API for USD→EUR/INR rates.

📊 **[View Sequence Diagrams](SEQUENCE_DIAGRAM.md)** - Detailed flow diagrams for login, CRUD operations, and system architecture.

## Repository Structure

backend/
	server.js          
	models/Transaction.js
	routes/transactions.js
	routes/rates.js
frontend/
	src/App.jsx        
	src/pages/Login.jsx
	src/pages/Transactions.jsx
	vite.config.js     


## Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Google OAuth Client ID (Web application) with your app origin and redirect URI allowed


## Environment Variables
Create these files before running locally or deploying:

backend/.env
MONGO_URI="<your MongoDB connection string>"

frontend/.env.local
VITE_GOOGLE_CLIENT_ID="your Google OAuth client id"
VITE_GOOGLE_CLIENT_SECRET="you Google OAuth client secret"


## API Reference
Base URL: `/api`

Transactions
- `GET /transactions/:userId` — list transactions for a user (sorted newest first)
- `POST /transactions` — create `{ userId, name, amount, type }`
- `PUT /transactions/:id` — update a transaction by id
- `DELETE /transactions/:id` — delete a transaction by id

Exchange Rates
- `GET /rates` — returns latest USD→EUR/INR rates from Frankfurter

## Data Model
`Transaction`
```json
{
	"userId": "string",    // required
	"name": "string",      // required, min 3 chars
	"amount": 123.45,       // required, non-negative
	"type": "income" | "expense", // required
	"createdAt": "ISO date"
}
```

## Local Development
1) Backend
```bash
cd backend
npm install
npm start
# runs on http://localhost:5000
```

2) Frontend (in another terminal)
```bash
cd frontend
npm install
npm run dev -- --host
# dev server on http://localhost:5173 with proxy to http://localhost:5000/api
```

Login with Google; a successful login stores the Google `sub` as `userId` in `localStorage` and routes to `/transactions`.


## Production
The backend serves the built React app from `frontend/dist`.

```bash
# Build frontend
cd frontend
npm install
npm run build

# Start backend (serves API + static frontend)
cd ../backend
npm install
npm start
```

## Deploy notes:
- Ensure `frontend/dist` exists in the deployed artifact
- Set `MONGO_URI` in your hosting environment.
- Expose port 5000 (or configure your host to map it). If your host assigns a dynamic port, set an env var `PORT` (e.g., `PORT=8080`) and update `backend/server.js` to use `const PORT = process.env.PORT || 5000;` before starting the server.

## Deployment status (for professor):
- App runs locally with the steps above. The latest deploy attempt on the host failed because the server could not find `index.html` to serve (the build was present locally). I tried workarounds and debugging, but due to time constraints I'm documenting this here.


