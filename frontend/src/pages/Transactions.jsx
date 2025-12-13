import { useState } from 'react';
import useSWR from "swr";
import { Card, Row, Col } from 'react-bootstrap';

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

  // Fetch exchange rates
  const {
    data: ratesData,
    error: ratesError,
    isLoading: ratesLoading,
  } = useSWR('/api/rates', fetcher);

  // State for form inputs
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  
  // State for showing/hiding form
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  
  // State for delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Function to clear form and close pop up
  const clearForm = () => {
    setTransactionName('');
    setTransactionAmount('');
    setTransactionType('expense');
    setEditingId(null);
    setShowForm(false);
  };

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

  // Extract rates
  const rates = ratesData?.rates || {};

  // Handle form submit (Create POST or Update PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionName || !transactionAmount) {
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
    clearForm();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (deleteConfirmId === id) {
      // Confirmed - proceed with deletion
      await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      mutate(
        list.filter((t) => t._id !== id),
        false
      );
      
      setDeleteConfirmId(null);
    } else {
      // Show confirmation state
      setDeleteConfirmId(id);
    }
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
      <h1 className='tracking-in-expand'>TRANSACTIONS</h1>
      <p className='tracking-in-expand'><em>Manage your income and expenses to keep track of your financial health.</em></p>
     
      {/* Summary Cards */}
      <section className="card-grid">
        <Card className="shadow-pop-tr">
          <Card.Body>
            <Card.Title>BALANCES</Card.Title>
            <Card.Text className="amount">${balance.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

        <Card className="shadow-pop-tr">
          <Card.Body>
            <Card.Title>SALARY</Card.Title>
            <Card.Text className="amount amount-positive">${salary.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

        <Card className="shadow-pop-tr">
          <Card.Body>
            <Card.Title>EXPENSES</Card.Title>
            <Card.Text className="amount amount-negative">${expenses.toLocaleString()}</Card.Text>
          </Card.Body>
        </Card>

      </section>

      {/* Two-column layout: Transactions & Exchange Rates */}
      <Row>
        <Col md={9}>
          <section className="transaction-list ">
            <h4 className='tracking-in-expand'>List of transactions</h4>
            {list.length === 0 ? (
              <p className='tracking-in-expand'>No transactions yet. Add your transactions!</p>
            ) : (
              <section>
                {list.map((transaction) => (
                  <Card key={transaction._id} className="transaction-card shadow-pop-tr">
                    <Card.Body>
                      <Card.Title>{transaction.name}</Card.Title>
                      <Card.Text>
                        ${transaction.amount.toLocaleString()} - {transaction.type}
                      </Card.Text>
                      <Card.Text>
                        Date: {new Date(transaction.createdAt).toLocaleDateString()}
                      </Card.Text>
                      {deleteConfirmId === transaction._id && (
                        <p className="delete-warning">Are you sure? Click delete again to confirm.</p>
                      )}
                      <button onClick={() => handleEdit(transaction)} className="edit">Edit</button>
                      <button onClick={() => handleDelete(transaction._id)} className="delete">Delete</button>
                      {deleteConfirmId === transaction._id && (
                        <button 
                          type="button"
                          className="cancel-delete-button"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </button>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </section>
            )}
          </section>
        </Col>

        <Col md={3}>
          {/* Exchange Rates Panel */}
          <aside className="exchange-rates shadow-pop-tr">
            <h5>Exchange Rates</h5>
            {ratesLoading ? (
              <p>Loading rates...</p>
            ) : ratesError ? (
              <p>Error loading rates</p>
            ) : (
              <>
                <p>1 USD = €{rates.EUR} (EUR)</p>
                <p>1 USD = ₹{rates.INR} (INR)</p>
              </>
            )}
          </aside>
        </Col>
      </Row>

      {/* add a transaction */}
      <button className="add-transaction-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel Transaction' : 'Add Transaction'}
      </button> 

      {showForm && (
        <aside className="customform-overlay" onClick={clearForm}>
          <section className="customform-content" onClick={(e) => e.stopPropagation()}>
            <Card>
              <Card.Body>
                <Card.Title> {editingId ? 'Edit Transaction' : 'Add Transaction'} </Card.Title>
                <p className="validation-error">Please fill in all fields!</p>
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

                  <section>
                    <button type="submit" className="submit-button">  {editingId ? 'Update' : 'Submit'} </button>
                    <button type="button" className="cancel-button" onClick={clearForm}>Cancel</button>
                  </section>
                  
                </form>  
              </Card.Body>
            </Card>
          </section>
        </aside>
      )}


    </section>
  );
}
