import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DriverAttendance.css";

const API_BASE_URL = "https://appsail-50024000807.development.catalystappsail.in";

const DriverAttendance = () => {
  const [loginData, setLoginData] = useState([]);
  const [logoutData, setLogoutData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch login & logout data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loginRes, logoutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/drivers_login`),
          fetch(`${API_BASE_URL}/drivers_logout`),
        ]);
        const loginJson = await loginRes.json();
        const logoutJson = await logoutRes.json();

        setLoginData(loginJson);
        setLogoutData(logoutJson);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loginData.length > 0 && logoutData.length > 0) {
      const mergedAttendance = loginData.map((login) => {
        const logout = logoutData.find((l) => l.mobile === login.mobile);
  
        if (!logout) return null;
  
        const loginTime = new Date(login.login_at);
        const logoutTime = new Date(logout.logout_at);
  
        // Check if logout time is later than login time
        if (logoutTime <= loginTime) {
          console.warn(`Invalid time range for driver ${login.driver_name}: logout time is not later than login time.`);
          return null; // Skip this record
        }
  
        const workingHours = (logoutTime - loginTime) / (1000 * 60 * 60); // Convert ms to hours
  
        return {
          driver: login.driver_name,
          mobile: login.mobile,
          date: loginTime.toISOString().split("T")[0], // Extract date
          login_at: login.login_at,
          logout_at: logout.logout_at,
          working_hours: parseFloat(workingHours.toFixed(2)),
        };
      }).filter(Boolean);
  
      setAttendance(mergedAttendance);
    }
  }, [loginData, logoutData]);

  const filteredAttendance = attendance.filter((a) => a.date === selectedDate.toISOString().split("T")[0]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Driver Attendance Dashboard</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <h3>Attendance for {selectedDate.toDateString()}</h3>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Mobile</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Working Hours</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((data, index) => (
              <tr key={index}>
                <td>{data.driver}</td>
                <td>{data.mobile}</td>
                <td>{new Date(data.login_at).toLocaleTimeString()}</td>
                <td>{new Date(data.logout_at).toLocaleTimeString()}</td>
                <td>{data.working_hours} hrs</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="chart-container">
        <h3>Working Hours Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="driver" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="working_hours" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DriverAttendance;