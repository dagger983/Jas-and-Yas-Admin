import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt, FaMoneyBillWave, FaClock, FaChartLine } from "react-icons/fa";
import "./BookingStats.css"; // Import the CSS file

const BookingStats = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    axios
      .get("https://appsail-50024000807.development.catalystappsail.in/otp")
      .then((response) => {
        console.log("API Response:", response.data);
        setBookings(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const filteredBookings = bookings.filter((b) => 
    b.created_at && b.created_at.startsWith(formatDate(selectedDate))
  );

  const totalRevenue = Number(
    filteredBookings.reduce((acc, b) => acc + (Number(b.price) || 0), 0)
  );

  const avgRevenue = filteredBookings.length
    ? (totalRevenue / filteredBookings.length).toFixed(2)
    : "0.00";

  const timeCounts = filteredBookings.reduce((acc, b) => {
    if (!b.created_at) return acc;
    const parts = b.created_at.split(" ");
    if (parts.length < 2) return acc;

    const time = parts[1].split(":")[0] + ":00";
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});

  const bestTime = Object.entries(timeCounts).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["00:00", 0]
  )[0];

  return (
    <div className="booking-stats-container">
      <h2 className="title">📊 Booking Statistics</h2>

      {/* Calendar */}
      <div className="calendar-container">
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <h3 className="subtitle">
        Stats for <span className="highlight">{formatDate(selectedDate)}</span>
      </h3>

      {/* Stats Container */}
      <div className="stats-grid">
        
        {/* Total Bookings */}
        <div className="stat-card blue">
          <FaCalendarAlt className="icon" />
          <div>
            <p>Total Bookings</p>
            <h3>{filteredBookings.length}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat-card green">
          <FaMoneyBillWave className="icon" />
          <div>
            <p>Total Revenue</p>
            <h3>₹{totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Avg Revenue */}
        <div className="stat-card purple">
          <FaChartLine className="icon" />
          <div>
            <p>Avg Revenue</p>
            <h3>₹{avgRevenue}</h3>
          </div>
        </div>

        {/* Busiest Hour */}
        <div className="stat-card red">
          <FaClock className="icon" />
          <div>
            <p>Busiest Hour</p>
            <h3>{bestTime}</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingStats;
