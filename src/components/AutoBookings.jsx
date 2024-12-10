import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AutoBookings.css';

const AutoBookings = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [sentOrders, setSentOrders] = useState([]);

  const fetchOrders = () => {
    axios
      .get('https://jasandyas-backend.onrender.com/adminData')
      .then((response) => {
        setOrders((prevOrders) => {
          // Merge new orders with the existing ones
          const updatedOrders = [...prevOrders];
          response.data.forEach((newOrder) => {
            if (!prevOrders.find((order) => order.id === newOrder.id)) {
              updatedOrders.push(newOrder);
            }
          });
          return updatedOrders;
        });
      })
      .catch(() => setError('Failed to fetch orders'));
  };

  const fetchDrivers = () => {
    axios
      .get('https://jasandyas-backend.onrender.com/autoData')
      .then((response) => setDrivers(response.data))
      .catch(() => setError('Failed to fetch drivers'));
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();
    fetchDrivers();
    setLoading(false);

    // Polling for updates every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
      fetchDrivers();
    }, 30000); // Adjust interval as needed

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleDriverSelect = (orderId, driverId) => {
    setSelectedDrivers((prev) => ({ ...prev, [orderId]: driverId }));
  };

  const handleSend = (order) => {
    const selectedDriverId = selectedDrivers[order.id];
    if (!selectedDriverId) {
      alert('Please select a driver before sending.');
      return;
    }
  
    const selectedDriver = drivers.find(
      (driver) => driver.id === parseInt(selectedDriverId)
    );
    if (!selectedDriver) {
      alert('Invalid driver selection.');
      return;
    }
  
    const rideData = {
      customer: order.username,
      mobile: order.mobile,
      pickup_location: order.pickup_location_name,
      drop_location: order.drop_location_name,
      auto_driver: selectedDriver.Driver,
      driver_mobile: selectedDriver.Mobile,
    };
  
    axios
      .post('https://jasandyas-backend.onrender.com/rideData', rideData)
      .then(() => {
        alert('Ride Booked Successfully!');
        setSentOrders((prevSentOrders) => [...prevSentOrders, order.id]);
  
        // Delete the order from adminData
        axios
          .delete(`https://jasandyas-backend.onrender.com/adminData/${order.id}`)
          .then(() => {
            setOrders((prevOrders) =>
              prevOrders.filter((o) => o.id !== order.id)
            );
            console.log(`Order ID ${order.id} deleted successfully.`);
          })
          .catch((err) => {
            console.error('Error deleting order:', err);
            alert('Failed to delete the order from admin data.');
          });
      })
      .catch((err) => {
        console.error('Error sending ride data:', err);
        alert('Failed to send ride data.');
      });
  };
  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="auto-bookings-container">
      <h4>Auto Bookings</h4>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Mobile</th>
              <th>Distance(km)</th>
              <th>Pickup Location</th>
              <th>Drop Location</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Driver Transfer</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={sentOrders.includes(order.id) ? 'struck-through' : ''}
              >
                <td>{order.id}</td>
                <td>{order.username}</td>
                <td>{order.mobile}</td>
                <td>{order.distance}</td>
                <td>{order.pickup_location_name}</td>
                <td>{order.drop_location_name}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{new Date(order.updated_at).toLocaleString()}</td>
                <td>
                  <select
                    value={selectedDrivers[order.id] || ''}
                    onChange={(e) => handleDriverSelect(order.id, e.target.value)}
                  >
                    <option value="" disabled>
                      Assign Driver
                    </option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.Driver}
                      </option>
                    ))}
                  </select>
                  <button
                    className="send-button"
                    onClick={() => handleSend(order)}
                  >
                    Send
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoBookings;
