import React from "react";
import AutoBookings from "./components/AutoBookings";
import DriverCrud from "./components/DriverCrud";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import DriverAttendance from "./components/DriverAttendance";
import ProductManager from "./components/ProductManager";
import DriverRides from "./components/DriverRides";
import Login from "./components/Login";
import VideoManager from "./components/VideoManager";
import UserManagement from "./components/UserManagement";
const App = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <div className="app-layout">
      {isAuthenticated && <Sidebar activeRoute={location.pathname} />}
      <div className="main-content">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <AutoBookings /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/Driver"
            element={isAuthenticated ? <DriverCrud /> : <Navigate to="/login" />}
          />
          <Route
            path="/DriverEntry"
            element={
              isAuthenticated ? <DriverAttendance /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/ProductManager"
            element={
              isAuthenticated ? <ProductManager /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/DriverRides"
            element={
              isAuthenticated ? <DriverRides /> : <Navigate to="/login" />
            }
          />
           <Route
            path="/Video"
            element={
              isAuthenticated ? <VideoManager /> : <Navigate to="/login" />
            }
          />
             <Route
            path="/User"
            element={
              isAuthenticated ? <UserManagement /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;