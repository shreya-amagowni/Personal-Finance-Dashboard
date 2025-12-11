import { useReducer, useState } from 'react';
import Card from 'react-bootstrap/Card';

// Reducer function
function transactionReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return [...state, action.payload];
    case 'DELETE_TRANSACTION':
      return state.filter(t => t.id !== action.payload);
    case 'UPDATE_TRANSACTION':
      return state.map(t => 
        t.id === action.payload.id ? action.payload : t
      );
    default:
      return state;
  }
}

export default function Transactions() {
  // State for form inputs
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  
  // Use reducer for transactions
  const [transactions, dispatch] = useReducer(transactionReducer, []);
  
  // State for showing/hiding form
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);

  // Calculate totals dynamically from transactions
  const salary = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = salary - expenses;

  // Handle form submit (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!transactionName || !transactionAmount) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      // Update existing transaction
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: {
          id: editingId,
          name: transactionName,
          amount: Number(transactionAmount),
          type: transactionType
        }
      });
      setEditingId(null);
    } else {
      // Add new transaction
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: Date.now(),
          name: transactionName,
          amount: Number(transactionAmount),
          type: transactionType
        }
      });
    }

    // Clear form
    setTransactionName('');
    setTransactionAmount('');
    setTransactionType('expense');
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setTransactionName(transaction.name);
    setTransactionAmount(transaction.amount);
    setTransactionType(transaction.type);
    setEditingId(transaction.id);
    setShowForm(true);
  };

  return (
    <section className="transactions-page">
      <h1>Transactions</h1>

      <section className="card-grid">
        <Card>
          <Card.Body>
            <Card.Title>Balances</Card.Title>
            <Card.Text className="amount">${balance.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Salary</Card.Title>
            <Card.Text className="amount amount-positive">${salary.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title>Expenses</Card.Title>
            <Card.Text className="amount amount-negative">${expenses.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

      </section>

      <section className="transaction-list">
        <h4>List of transactions</h4>
        {transactions.length === 0 ? (
          <p>No transactions yet. Add your transactions!</p>
        ) : (
          <section>
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="transaction-card">
                <Card.Body>
                  <Card.Title>{transaction.name}</Card.Title>
                  <Card.Text>${transaction.amount.toLocaleString()} - {transaction.type}</Card.Text>
                  <button onClick={() => handleEdit(transaction)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(transaction.id)} className="delete">Delete</button>
                </Card.Body>
              </Card>
            ))}
          </section>
        )}
      </section>

      {/* add a transaction */}
      <button className="add-transaction-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel Transaction' : 'Add Transaction'}
      </button> 

      <section className="add-transaction">
        {showForm && (
          <Card>
            <Card.Body>
              <Card.Title> {editingId ? 'Edit Transaction' : 'Add Transaction'} </Card.Title>
              <form className="add-transaction-form" onSubmit={handleSubmit}>
                <label className="transaction-name"> Transaction Name:
                  <input 
                    type="text"
                    value={transactionName}
                    onChange={(e) => setTransactionName(e.target.value)}
                    placeholder="Enter transaction name"
                    className="form-control"
                  />
                </label>

                <label className='transaction-amount'> Amount:
                  <input 
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="form-control"
                  />
                </label>

                <label className='transaction-type'> Type:
                  <select 
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="form-select"
                    >              
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </label>
                
                <button type="submit" className="submit-button">  {editingId ? 'Update' : 'Submit'} </button>
                
              </form>  
            </Card.Body>
          </Card>
        )}

      </section>

    </section>
  );
}
