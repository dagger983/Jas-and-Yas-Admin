import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AutoBookings.css';

const AutoBookings = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [sentOrders, setSentOrders] = useState([]);
  const [loadingOrderIds, setLoadingOrderIds] = useState([]); // Track loading for multiple orders
  const [fetchInterval, setFetchInterval] = useState(5000); // Default: 5 seconds

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://appsail-50024000807.development.catalystappsail.in/adminData`
      );
      const newOrders = response.data.filter(
        (order) => !sentOrders.includes(order.id)
      );

      setOrders((prevOrders) => {
        const combinedOrders = [...newOrders, ...prevOrders];
        const uniqueOrders = combinedOrders.filter(
          (order, index, self) =>
            index === self.findIndex((o) => o.id === order.id)
        );
        return uniqueOrders;
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Error handled silently; the function retries automatically on the next interval
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        `https://appsail-50024000807.development.catalystappsail.in/autoData`
      );
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Error handled silently; the function retries automatically on the next interval
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchDrivers()]);
      setLoading(false);
    };

    initializeData();

    const interval = setInterval(() => {
      fetchOrders();
    }, fetchInterval);

    return () => clearInterval(interval); // Clean up on unmount
  }, [sentOrders, fetchInterval]);

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
      price: order.price,
      OTP: order.OTP,
      members: order.members,
    };

    setLoadingOrderIds((prev) => [...prev, order.id]); // Add to loading state for this order

    try {
      await axios.post(
        `https://appsail-50024000807.development.catalystappsail.in/rideData`,
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
        `https://appsail-50024000807.development.catalystappsail.in/${order.id}`
      );
    } catch (error) {
      console.error('Error sending ride data:', error);
      alert('Failed to send ride data.');
    } finally {
      setLoadingOrderIds((prev) => prev.filter((id) => id !== order.id)); // Remove from loading state
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
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
              <th>Price(₹)</th>
              <th>Pickup Location</th>
              <th>Drop Location</th>
              <th>Booked At</th>
              <th>Members</th>
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
                <td>{order.price}</td>
                <td>{order.pickup_location_name}</td>
                <td>{order.drop_location_name}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
               
                <td>{order.members}</td>
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
                    disabled={loadingOrderIds.includes(order.id)} // Disable if order is being processed
                  >
                    {loadingOrderIds.includes(order.id) ? (
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
