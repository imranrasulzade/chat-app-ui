import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountService from '../services/AccountService';
import UserList from './UserList';
import '../styles/ChatPage.css';
import UserService from '../services/UserService';
import MessageService from '../services/MessageService';

function ChatPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const userName = localStorage.getItem('username');
  const userId = localStorage.getItem('id'); // Assuming you store the user ID in local storage

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        const response = await UserService.getUsers(token, userId);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    const token = localStorage.getItem('token');
    try {
      const response = await MessageService.getChatMessages(token, userId, user.id);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    AccountService.signOut(token);
    localStorage.clear();
    navigate('/');
  };

  const handleSendMessage = async () => {
    // Implement sendMessage functionality here
    // This will involve calling the backend API to send the message
    // and updating the messages state to reflect the new message
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="user-info">
          <span>{userName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="chat-container">
        <UserList users={users} onUserClick={handleUserClick} />
        <div className="chat-box">
          {selectedUser ? (
            <div>
              <h3>Chat with {selectedUser.userName}</h3>
              <div className="messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${
                      message.sender.id === parseInt(userId) ? 'sent' : 'received'
                    }`}
                  >
                    {message.content}
                    <br/>
                    <br/>
                    <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
