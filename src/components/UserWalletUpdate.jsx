import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserWalletUpdate.css';

const UserWalletUpdate = () => {
  const [formData, setFormData] = useState({
    username: '',
    address: '',
    contact_number: '',
    temporary_contact_number: '',
    spend: '',
    product_brand: '',
    product_price: '',
    quantity: '',
    category_specific_details: '',
  });

  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('https://appsail-50024000807.development.catalystappsail.in/user-expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://appsail-50024000807.development.catalystappsail.in/user-expenses', formData);
      setMessage(res.data.message);
      fetchExpenses();
      setFormData({
        username: '',
        address: '',
        contact_number: '',
        temporary_contact_number: '',
        spend: '',
        product_brand: '',
        product_price: '',
        quantity: '',
        category_specific_details: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setMessage('Error submitting form');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="wallet-container">
      <h2>User Wallet Update</h2>
      <form onSubmit={handleSubmit} className="wallet-form">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label>{key.replace(/_/g, ' ')}:</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Submitted Expenses</h3>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            <strong>{expense.username}</strong> spent ₹{expense.spend} on {expense.product_brand}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserWalletUpdate;
