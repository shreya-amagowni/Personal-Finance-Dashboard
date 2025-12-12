import { useState } from 'react';
import useSWR from "swr";
import Card from 'react-bootstrap/Card';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Transactions() {
  const userId = localStorage.getItem("userId");

  // Fetch all transactions
  const {
    data: transactions,
    error,
    mutate,
    isLoading,
  } = useSWR(
    userId ? `/api/transactions/${userId}` : null,
    fetcher
  );

  // State for form inputs
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  
  // State for showing/hiding form
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);

  // Loading state
  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Error fetching data.</p>;


  const list = transactions || [];

  // Calculate totals dynamically from transactions
  const salary = list
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = list
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = salary - expenses;

  // Handle form submit (Create POST or Update PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionName || !transactionAmount) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      const res = await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, 
          name: transactionName,
          amount: Number(transactionAmount),
          type: transactionType,
        }),
      });

      const updated = await res.json();

      mutate(
        list.map((t) => (t._id === editingId ? updated : t)),
        false
      );

      setEditingId(null);
    } 

    else {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: transactionName,
          amount: Number(transactionAmount),
          type: transactionType,
        }),
      });
      
      const newTransaction = await res.json();
      mutate([newTransaction, ...list], false);
    }

    // Clear form
    setTransactionName('');
    setTransactionAmount('');
    setTransactionType('expense');
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });

    mutate(
      list.filter((t) => t._id !== id),
      false
    );
  };


  // Handle edit
  const handleEdit = (transaction) => {
    setTransactionName(transaction.name);
    setTransactionAmount(transaction.amount);
    setTransactionType(transaction.type);
    setEditingId(transaction._id);
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
        {list.length === 0 ? (
          <p>No transactions yet. Add your transactions!</p>
        ) : (
          <section>
            {list.map((transaction) => (
              <Card key={transaction._id} className="transaction-card">
                <Card.Body>
                  <Card.Title>{transaction.name}</Card.Title>
                  <Card.Text>${transaction.amount.toLocaleString()} - {transaction.type}</Card.Text>
                  <button onClick={() => handleEdit(transaction)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(transaction._id)} className="delete">Delete</button>
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
