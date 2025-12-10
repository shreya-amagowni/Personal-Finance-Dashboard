import { useState } from 'react';
import Card from 'react-bootstrap/Card';

export default function Transactions() {
  // Sample data - you can replace this with real data from your backend
  const balance = 5000;
  const salary = 8000;
  const expenses = 3000;

  // State for form inputs
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  
  // State for transactions list
  const [transactions, setTransactions] = useState([]);
  
  // State for showing/hiding form
  const [showForm, setShowForm] = useState(false);

  // Handle form submit (Create)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!transactionName || !transactionAmount) {
      alert('Please fill in all fields');
      return;
    }

    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      name: transactionName,
      amount: Number(transactionAmount),
      type: transactionType
    };
    setTransactions([...transactions, newTransaction]);

    // Clear form
    setTransactionName('');
    setTransactionAmount('');
    setTransactionType('expense');
    setShowForm(false);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
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
              <Card.Title>Add Transaction</Card.Title>
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
                

                <button type="submit" className="submit-button">Submit</button>
                
              </form>  
            </Card.Body>
          </Card>
        )}

      </section>



    </section>
  );
}
