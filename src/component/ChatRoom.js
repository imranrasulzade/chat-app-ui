import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs'; 
import SockJS from 'sockjs-client'; 
import '../styles/ChatRoom.css';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('Connected');
                stompClient.subscribe('/topic/public', (msg) => {
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
        });

        stompClient.activate();
        setStompClient(stompClient);

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && message) {
            const chatMessage = {
                sender: 1,  // burani login olan user ile deyisecem
                content: message,
                receiver: 2, // receiveri set edecem
            };
            stompClient.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });
            setMessage('');
        }
    };

    return (
        <div className="chat-room">
            <h1>Chat Room</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.senderId}: </strong>{msg.content}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
