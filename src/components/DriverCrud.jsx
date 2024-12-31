import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Driver.css';

const DriverCrud = () => {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ Driver: '', Mobile: '', Password: '' });
  const [modalTitle, setModalTitle] = useState('Add New Driver');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('https://appsail-50024000807.development.catalystappsail.in/autoData');
      setDrivers(response.data);
    } catch (error) {
      setError('Failed to fetch drivers.');
      console.error('Error fetching drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setModalTitle('Add New Driver');
    setFormData({ Driver: '', Mobile: '', Password: '' });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://jasandyas-backend.onrender.com/autoData', formData);
      setShowModal(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error adding driver:', error);
      setError('Failed to add driver.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await axios.delete(`https://jasandyas-backend.onrender.com/autoData/${id}`);
        fetchDrivers(); // Refresh the drivers list after deletion
      } catch (error) {
        console.error('Error deleting driver:', error);
        setError('Failed to delete driver.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Driver Management</h1>
      <button className="btn" onClick={openModal}>Add New Driver</button>

      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <p>Loading drivers...</p>
      ) : (
        <table className="driver-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.Driver}</td>
                <td>{driver.Mobile}</td>
                <td>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(driver.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="Driver"
                placeholder="Driver Name"
                value={formData.Driver}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="Mobile"
                placeholder="Mobile"
                value={formData.Mobile}
                onChange={handleChange}
                pattern="^\d{10}$"
                title="Enter a valid 10-digit mobile number."
                required
              />
              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="btn submit-btn">Add Driver</button>
                <button type="button" className="btn cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverCrud;
