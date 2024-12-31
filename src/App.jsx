import React from "react";
import AutoBookings from "./components/AutoBookings";
import DriverCrud from "./components/DriverCrud";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar activeRoute={location.pathname} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<AutoBookings />} />
          <Route path="/Driver" element={<DriverCrud />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
