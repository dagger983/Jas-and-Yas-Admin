import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        className="toggle-btn"
        onClick={toggleSidebar}
        aria-expanded={!collapsed}
      >
        ☰
      </button>
      <ul className="sidebar-menu" role="menu">
        {[
          { name: "Booking", href: "/" },
          { name: "Drivers", href: "/Driver" },
          { name: "about", href: "#about" },
          { name: "contact", href: "#contact" },
        ].map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${
              activeItem === item.name ? "active" : ""
            }`}
            onClick={() => handleItemClick(item.name)}
            role="menuitem"
          >
            <Link to={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
