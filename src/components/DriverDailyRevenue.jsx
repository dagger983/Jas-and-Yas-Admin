import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DriverDailyRevenue.css"; // Import CSS file

const DriverDailyRevenue = () => {
  const [data, setData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetch("https://appsail-50024000807.development.catalystappsail.in/otp")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Extract unique driver names
  const driverNames = useMemo(() => [...new Set(data.map((item) => item.auto_driver))], [data]);

  // Format selected date to YYYY-MM-DD
  const formattedDate = useMemo(() => selectedDate.toISOString().split("T")[0], [selectedDate]);

  // Filter data by driver name and selected date
  const filteredData = useMemo(() => 
    data.filter(
      (item) =>
        item.auto_driver.toLowerCase() === selectedDriver.toLowerCase() &&
        item.created_at.startsWith(formattedDate)
    ), 
    [data, selectedDriver, formattedDate] // ✅ Corrected dependency array
  );

  // Calculate total earnings safely
  const totalEarnings = useMemo(() => 
    filteredData.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    [filteredData]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="driver-revenue-container">
      <h2 className="title">Driver Daily Revenue</h2>

      {/* Driver Dropdown */}
      <select
        className="dropdown"
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        aria-label="Select a driver"
      >
        <option value="">Select a Driver</option>
        {driverNames.map((driver, index) => (
          <option key={index} value={driver}>
            {driver}
          </option>
        ))}
      </select>

      {/* React Calendar */}
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      {/* Earnings Summary */}
      <h3 className="earnings">Total Earnings: ₹{totalEarnings.toFixed(2)}</h3>

      {/* Filtered Data Table */}
      {filteredData.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.customer}</td>
                <td>{item.pickup_location}</td>
                <td>{item.drop_location}</td>
                <td>₹{Number(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No data found for this driver & date.</p>
      )}
    </div>
  );
};

export default DriverDailyRevenue;
