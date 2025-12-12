import { Schema, model } from 'mongoose';

const TransactionSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Transaction name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.00, 'Amount cannot be negative']
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Type must be either income or expense']
    },
    description: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export default model('Transaction', TransactionSchema);
