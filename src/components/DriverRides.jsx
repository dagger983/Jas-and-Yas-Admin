import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, Legend, Cell, ResponsiveContainer } from "recharts";
import "./DriverRides.css";

const DriverRides = () => {
  const [rideData, setRideData] = useState([]);

  useEffect(() => {
    // Fetch ride data from API
    fetch("https://appsail-50024000807.development.catalystappsail.in/otp")
      .then(response => response.json())
      .then(data => setRideData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Aggregate earnings per driver
  const earnings = rideData.reduce((acc, ride) => {
    acc[ride.auto_driver] = (acc[ride.auto_driver] || 0) + parseFloat(ride.price);
    return acc;
  }, {});

  const chartData = Object.keys(earnings).map(driver => ({
    name: driver,
    earnings: earnings[driver]
  }));

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard-container">
      <h2>Driver Earnings Dashboard</h2>
      
      <div className="charts-container">
        {/* Bar Chart */}
        <div className="chart">
          <h3>Total Earnings per Driver</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart">
          <h3>Earnings Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="earnings" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard">
        <h3>Top Earning Drivers</h3>
        <ul>
          {chartData.sort((a, b) => b.earnings - a.earnings).map((driver, index) => (
            <li key={index}>{driver.name}: ₹{driver.earnings}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DriverRides;