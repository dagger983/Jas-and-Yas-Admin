import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://appsail-50024000807.development.catalystappsail.in/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginTop: '20px',marginLeft:"30px", fontWeight: 'bold', fontSize: '48px' }}>User List</h2>
       <p style={{ marginTop: '20px',marginLeft:"30px", fontWeight: 'bold', fontSize: '48px' }}>
        Total Users: {users.length}
      </p>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default UserList;
