import React, { useEffect, useState } from "react";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const otpResponse = await fetch(
          "https://appsail-50024000807.development.catalystappsail.in/otp"
        );
        const otpData = await otpResponse.json();
  
        const userExpensesResponse = await fetch(
          "https://appsail-50024000807.development.catalystappsail.in/user-expenses"
        );
        const userExpensesData = await userExpensesResponse.json();
  
        const userMap = {};
  
        otpData.forEach((otpUser) => {
          const { customer, price, mobile } = otpUser;
          const numericPrice = parseFloat(price) || 0;
  
          const key = `${customer}-${mobile}`;
          if (!userMap[key]) {
            userMap[key] = {
              username: customer,
              mobile,
              totalPrice: 0,
              totalSpend: 0,
            };
          }
  
          userMap[key].totalPrice += numericPrice;
        });
  
        userExpensesData.forEach((expense) => {
          const { username, spend, contact_number } = expense;
          const numericSpend = parseFloat(spend) || 0;
  
          const key = `${username}-${contact_number}`;
          if (!userMap[key]) {
            userMap[key] = {
              username,
              mobile: contact_number,
              totalPrice: 0,
              totalSpend: 0,
            };
          }
  
          userMap[key].totalSpend += numericSpend;
        });
  
        const combinedUsers = Object.values(userMap).map((user) => {
          const walletCash = user.totalPrice - user.totalSpend;
          return {
            username: user.username,
            mobile: user.mobile,
            totalPrice: user.totalPrice.toFixed(2),
            walletCash: walletCash.toFixed(2),
          };
        });
  
        // Sort users alphabetically by username
        combinedUsers.sort((a, b) =>
          a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        );
  
        setUsers(combinedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="header">User Management</h1>
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Total Price</th>
              <th>Wallet Cash</th>
              <th>Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.totalPrice}</td>
                <td>{user.walletCash}</td>
                <td>{user.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
