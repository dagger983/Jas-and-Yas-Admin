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
  const [loadingOrder, setLoadingOrder] = useState(null); // Track the loading state of the button
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [fetchInterval, setFetchInterval] = useState(5000); // Default: 30 seconds

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://appsail-50024000807.development.catalystappsail.in/adminData`
      );
      const newOrders = response.data.filter(
        (order) => !sentOrders.includes(order.id)
      );

      console.log(response)

      setOrders((prevOrders) => {
        const combinedOrders = [...newOrders, ...prevOrders];
        const uniqueOrders = combinedOrders.filter(
          (order, index, self) =>
            index === self.findIndex((o) => o.id === order.id)
        );
        return uniqueOrders;
      });

      setLastFetchedAt(new Date().toISOString());
    } catch {
      setError('Failed to fetch orders');
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `https://jasandyas-backend.onrender.com/autoData`
      );
      setDrivers(response.data);
    } catch {
      setError('Failed to fetch drivers');
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchDrivers()]);
      setLoading(false);
    };

    initializeData();

    let interval;
    const startPolling = () => {
      clearInterval(interval); // Clear previous interval if any
      interval = setInterval(() => {
        fetchOrders();
      }, fetchInterval);
    };

    startPolling();

    return () => clearInterval(interval); // Clean up on unmount
  }, [sentOrders, fetchInterval]); // Restart interval if `fetchInterval` changes

  const handleDriverSelect = (orderId, driverId) => {
    setSelectedDrivers((prev) => ({ ...prev, [orderId]: driverId }));
  };

  const handleSend = async (order) => {
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
  
    if (!order.OTP) {
      alert(`OTP is missing for order ID ${order.id}`);
      return;
    }
  
    const rideData = {
      customer: order.username,
      mobile: order.mobile,
      pickup_location: order.pickup_location_name,
      drop_location: order.drop_location_name,
      auto_driver: selectedDriver.Driver,
      driver_mobile: selectedDriver.Mobile,
      mode: order.mode,
      OTP: order.OTP,
    };
  
    console.log('Ride data payload:', rideData);
  
    setLoadingOrder(order.id); // Set loading state for this order
  
    try {
      await axios.post(
        `https://jasandyas-backend.onrender.com/rideData`,
        rideData
      );
      alert('Ride Booked Successfully!');
      setSentOrders((prev) => [...prev, order.id]);
  
      // Optimistically update orders
      setOrders((prevOrders) =>
        prevOrders.filter((o) => o.id !== order.id)
      );
  
      // Remove from adminData
      await axios.delete(
        `https://jasandyas-backend.onrender.com/adminData/${order.id}`
      );
    } catch (error) {
      console.error('Error sending ride data:', error);
      alert('Failed to send ride data.');
    } finally {
      setLoadingOrder(null); // Reset loading state
    }
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
              <th>Booked At</th>
              <th>Payment Mode</th>
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
                <td>{order.mode}</td>
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
                    disabled={loadingOrder === order.id} // Disable button while loading
                  >
                    {loadingOrder === order.id ? (
                      <div className="button-loader"></div>
                    ) : (
                      'Send'
                    )}
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
