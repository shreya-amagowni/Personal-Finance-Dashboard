import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import transactionsRoutes from './routes/transactions.js';
import ratesRoutes from './routes/rates.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '..','frontend', 'dist')));

// For any route not handled by API, serve index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// --- Start the Server --- //
const PORT = process.env.PORT ||5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});

