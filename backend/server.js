import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import transactionsRoutes from './routes/transactions.js';
import ratesRoutes from './routes/rates.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoutes);
app.use('/api/rates', ratesRoutes);

// Connect to MongoDB
connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// --- Start the Server --- //
app.listen(5000, () => {
  console.log("Backend Server running on http://localhost:5000");
});

