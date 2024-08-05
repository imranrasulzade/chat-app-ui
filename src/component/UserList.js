import React from 'react';
import '../styles/UserList.css';

function UserList({ users, onUserClick }) {
  if (!users || users.length === 0) {
    return <p>No users found</p>;
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onUserClick(user)}>
            {user.userName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
