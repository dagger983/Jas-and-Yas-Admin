import { useState, useEffect } from "react";
import axios from "axios";
import "./CancelClearance.css";

const CancelClearance  = () => {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch admin data from backend
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://appsail-50024000807.development.catalystappsail.in/adminData");
      setAdminData(response.data);
    } catch (err) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  // Delete record by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setLoading(true);
    try {
      await axios.delete(`https://jasandyas-backend.onrender.com/adminData/${id}`);
      
      // Remove the deleted record from the state
      setAdminData(adminData.filter(item => item.id !== id));
    } catch (err) {
      setError("Failed to delete the record.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-data">
      <h2>Admin Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Mobile</th>
            <th>Pickup Location</th>
            <th>Drop Location</th>
            <th>Price</th>
            <th>Members</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {adminData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.mobile}</td>
              <td>{item.pickup_location_name}</td>
              <td>{item.drop_location_name}</td>
              <td>₹{item.price}</td>
              <td>{item.members}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancelClearance ;
