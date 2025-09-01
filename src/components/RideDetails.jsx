import { useState, useEffect } from "react";
import "./RideDetails.css";

const RideDetails = () => {
  const [rideData, setRideData] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetch("https://appsail-50024000807.development.catalystappsail.in/rideData")
      .then((response) => response.json())
      .then((data) => setRideData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDelete = (id) => {
    setLoading(id);

    fetch(`https://appsail-50024000807.development.catalystappsail.in/rideData/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setRideData(rideData.filter((ride) => ride.id !== id));
        } else {
          console.error("Failed to delete the ride");
        }
      })
      .catch((error) => console.error("Error deleting ride:", error))
      .finally(() => setLoading(null));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats date to a readable format
  };

  return (
    <div className="container">
      <h2>Ride Details & Auto Driver Book Cancel</h2>
      <table className="ride-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Pickup Location</th>
            <th>Drop Location</th>
            <th>Auto Driver</th>
            <th>Driver Mobile</th>
            <th>Price</th>
            <th>OTP</th>
            <th>Members</th>
            <th>Booking Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rideData.map((ride) => (
            <tr key={ride.id}>
              <td>{ride.id}</td>
              <td>{ride.customer}</td>
              <td>{ride.mobile}</td>
              <td>{ride.pickup_location}</td>
              <td>{ride.drop_location}</td>
              <td>{ride.auto_driver}</td>
              <td>{ride.driver_mobile}</td>
              <td>₹{ride.price}</td>
              <td>{ride.OTP}</td>
              <td>{ride.members}</td>
              <td>{formatDate(ride.created_at)}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(ride.id)}
                  disabled={loading === ride.id}
                >
                  {loading === ride.id ? (
                    <div className="spinner"></div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideDetails;
