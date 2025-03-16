import { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchPin, setSearchPin] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [walletUpdate, setWalletUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // Track updating state per user

  const API_URL = "https://appsail-50024000807.development.catalystappsail.in/users";
  const UPDATE_WALLET_URL = "https://jasandyas-backend.onrender.com/update-wallet";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchPin(e.target.value);
    const filtered = users.filter((user) => user.pin.includes(e.target.value));
    setFilteredUsers(filtered);
  };

  const handleWalletChange = (id, mobile, value) => {
    setWalletUpdate((prev) => ({
      ...prev,
      [`${id}-${mobile}`]: value,
    }));
  };

  const updateWallet = (id, mobile) => {
    const newWalletAmount = Number(walletUpdate[`${id}-${mobile}`] || 0);

    setUpdating((prev) => ({ ...prev, [`${id}-${mobile}`]: true })); // Show loader

    axios
      .post(UPDATE_WALLET_URL, { id, mobile, amount: newWalletAmount })
      .then((response) => {
        alert("Wallet updated successfully!");

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id && user.mobile === mobile
              ? { ...user, wallet: response.data.wallet }
              : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id && user.mobile === mobile
              ? { ...user, wallet: response.data.wallet }
              : user
          )
        );
        setWalletUpdate((prev) => ({
          ...prev,
          [`${id}-${mobile}`]: "",
        }));
      })
      .catch((error) => {
        console.error("Error updating wallet:", error);
        alert("Failed to update wallet. Please try again.");
      })
      .finally(() => {
        setUpdating((prev) => ({ ...prev, [`${id}-${mobile}`]: false })); // Hide loader
      });
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by PIN"
          value={searchPin}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Mobile</th>
                <th>Wallet</th>
                <th>Update Wallet</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.mobile}</td>
                  <td className="wallet-amount">₹{user.wallet}</td>
                  <td className="wallet-update">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={walletUpdate[`${user.id}-${user.mobile}`] || ""}
                      onChange={(e) => handleWalletChange(user.id, user.mobile, e.target.value)}
                      className="wallet-input"
                    />
                    <button
                      onClick={() => updateWallet(user.id, user.mobile)}
                      className="update-btn"
                      disabled={updating[`${user.id}-${user.mobile}`]} // Disable while updating
                    >
                      {updating[`${user.id}-${user.mobile}`] ? (
                        <span className="loader"></span>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
