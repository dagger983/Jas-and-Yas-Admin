import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DriverAttendance.css";

const API_BASE_URL = "https://appsail-50024000807.development.catalystappsail.in";

const DriverAttendance = () => {
  const [loginData, setLoginData] = useState([]);
  const [logoutData, setLogoutData] = useState([]);
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

        if (!loginRes.ok || !logoutRes.ok) {
          throw new Error("Failed to fetch data");
        }

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

  // Process attendance data
  const attendance = useMemo(() => {
    if (loginData.length > 0 && logoutData.length > 0) {
      return loginData.map((login) => {
        const loginDate = new Date(login.login_at).toISOString().split("T")[0]; // Extract date
        const logout = logoutData.find(
          (l) => l.mobile === login.mobile && new Date(l.logout_at).toISOString().split("T")[0] === loginDate
        );

        if (!logout) return null;

        const loginTime = new Date(login.login_at);
        const logoutTime = new Date(logout.logout_at);

        if (logoutTime <= loginTime) {
          console.warn(`Invalid time range for driver ${login.driver_name}: logout time is not later than login time.`);
          return null;
        }

        const workingHours = (logoutTime - loginTime) / (1000 * 60 * 60);

        return {
          driver: login.driver_name,
          mobile: login.mobile,
          date: loginDate,
          login_at: loginTime.toLocaleTimeString(),
          logout_at: logoutTime.toLocaleTimeString(),
          working_hours: parseFloat(workingHours.toFixed(2)),
        };
      }).filter(Boolean);
    }
    return [];
  }, [loginData, logoutData]);

  // Filter data for the selected date
  const filteredAttendance = useMemo(() => {
    const selectedDateUTC = selectedDate.toISOString().split("T")[0];
    return attendance.filter((a) => a.date === selectedDateUTC);
  }, [attendance, selectedDate]);

  if (loading) {
    return <div className="loading-message">Loading data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Driver Attendance Dashboard</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} className="calendar" />

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
                <td>{data.login_at}</td>
                <td>{data.logout_at}</td>
                <td>{data.working_hours} hrs</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">No attendance data available for this date.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverAttendance;
