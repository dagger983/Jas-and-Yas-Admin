import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Driver.css"

const DriverCrud = () => {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ Driver: "", Mobile: "", Password: "" });
  const [modalTitle, setModalTitle] = useState("Add New Driver");

  // Fetch all drivers when the component loads
  useEffect(() => {
    axios.get("https://jasandyas-backend.onrender.com/autoData")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  }, []);

  // Open modal for adding driver
  const openModal = () => {
    setModalTitle("Add New Driver");
    setFormData({ Driver: "", Mobile: "", Password: "" });
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for create
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("https://jasandyas-backend.onrender.com/autoData", formData)
      .then(() => {
        setShowModal(false);
        fetchDrivers();
      })
      .catch((error) => {
        console.error("Error adding driver:", error);
      });
  };

  // Fetch updated list of drivers
  const fetchDrivers = () => {
    axios.get("https://jasandyas-backend.onrender.com/autoData")
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      });
  };

  return (
    <div className="container">
      <h1>Driver Management</h1>
      <button className="btn" onClick={openModal}>Add New Driver</button>

      {/* Driver Table */}
      <table className="driver-table">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.Driver}</td>
              <td>{driver.Mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add Driver */}
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
