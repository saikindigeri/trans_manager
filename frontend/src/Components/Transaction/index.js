

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './index.css';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'credit', amount: '', description: '' });
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    axios.get('https://trans-manager-1.onrender.com/api/transactions')
      .then(response => {
        setTransactions(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the transactions!', error);
      });
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleAddTransaction = () => {
    setShowForm(true);
    setError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ type: 'credit', amount: '', description: '' });
    setError('');
  };

  const handleSave = () => {
    if (!formData.amount || !formData.description) {
      setError('Amount and description are required.');
      return;
    }

    const amount = parseFloat(formData.amount);
    const newTransaction = {
      type: formData.type,
      amount,
      description: formData.description,
    };

    axios.post('https://trans-manager-1.onrender.com/api/transactions', newTransaction)
      .then(response => {
        setTransactions([...transactions, response.data]);
        setShowForm(false);
        setFormData({ type: 'credit', amount: '', description: '' });
        setError('');
      })
      .catch(error => {
        console.error('There was an error saving the transaction!', error);
        setError('There was an error saving the transaction.');
      });
  };


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`transaction-app ${theme}-theme`}>
    <button className="theme-toggle-button" onClick={toggleTheme}>
      <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
    </button>
    <button onClick={handleAddTransaction}>Add Transaction</button>
    {showForm && (
      <div className="transaction-form">
        {error && <div className="error">{error}</div>}
        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleFormChange}>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </label>
        <label>
          Amount:
          <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={formData.description} onChange={handleFormChange} />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    )}
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Credit</th>
          <th>Debit</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            <td>{transaction.date}</td>
            <td>{transaction.description}</td>
            <td>{transaction.type === 'credit' ? transaction.amount : ''}</td>
            <td>{transaction.type === 'debit' ? transaction.amount : ''}</td>
            <td>
              {transactions
                .slice(0, index + 1)
                .reduce(
                  (total, curr) =>
                    curr.type === 'credit' ? total + curr.amount : total - curr.amount,
                  0
                )
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  );
};

export default Transaction;
