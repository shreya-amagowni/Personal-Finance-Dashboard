import express from 'express';
import Transaction from '../models/Transaction.js';
const router = express.Router();

// GET transactions for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching transactions for userId:", userId);
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    console.log("Found transactions:", transactions.length);
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Server error while fetching transactions" });
  }
});

// POST new transaction
router.post('/', async (req, res) => {
  try {
    const { userId, name, amount, type } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const newTransaction = new Transaction({ userId, name, amount, type });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
