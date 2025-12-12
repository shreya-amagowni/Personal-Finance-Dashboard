import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import transactionsRoutes from './routes/transactions.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoutes);

// Connect to MongoDB
connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

/*// Routes 
app.get("/api/rates", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD"
    );
    const data = await response.json();
    res.json(data);
  } 
  catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});*/

// --- Start the Server --- //
app.listen(5000, () => {
  console.log("Backend Server running on http://localhost:5000");
});

