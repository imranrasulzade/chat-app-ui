import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AccountService from '../services/AccountService';
import UserList from './UserList';
import UserService from '../services/UserService';
import MessageService from '../services/MessageService';
import '../styles/ChatPage.css';

function ChatPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);

  const userName = localStorage.getItem('username');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await UserService.getUsers(token, userId, searchQuery);
        setUsers(response.data);
      } catch (error) {
        handleLogout();
        console.error('Error fetching users:', error);
        navigate('/');
      }
    };

    fetchUsers();
  }, [userId, searchQuery, navigate]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // console.log(str);
      },
      onConnect: () => {
        console.log('Connected');
        setIsConnected(true); 
        client.subscribe('/topic/public', (msg) => {
          if (msg.body) {
            const newMessage = JSON.parse(msg.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    const token = localStorage.getItem('token');
    try {
      const response = await MessageService.getChatMessages(token, userId, user.id);
      setMessages(response.data);
    } catch (error) {
      handleLogout();
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    AccountService.signOut(token);
    localStorage.clear();
    navigate('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isConnected && stompClient && newMessage && selectedUser) {
      const chatMessage = {
        sender: {
          id: userId,
          userName: userName,
        },
        content: newMessage,
        receiver: {
          id: selectedUser.id,
          userName: selectedUser.userName,
        },
        timestamp: new Date().toISOString(),
      };
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNewMessage('');
    } else {
      console.error('Cannot send message: STOMP client is not connected');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="chat-page">
      <nav className="chat-nav">
        <div className="user-info">
          <span>{userName}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="chat-container">
        <div className="user-list">
          <h3>Users</h3>
          <input
            type="text"
            className="search-bar"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <UserList users={users} onUserClick={handleUserClick} />
        </div>
        <div className="chat-box">
          {selectedUser ? (
            <div className="chat-content">
              <h3>Chat with {selectedUser.userName}</h3>
              <div className="messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-wrapper ${
                      message.sender.id === parseInt(userId) ? 'sent' : 'received'
                    }`}
                  >
                    <div className="message">{message.content}</div>
                    <span
                      className={`timestamp ${
                        message.sender.id === parseInt(userId)
                          ? 'sent-timestamp'
                          : 'received-timestamp'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="message-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button type="submit">Send</button>
              </form>
            </div>
          ) : (
            <div>Select a user to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
