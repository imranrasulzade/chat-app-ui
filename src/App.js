import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './component/FileUpload';
import Login from './component/Login';
import Register from './component/Register';
import ChatPage from './component/ChatPage';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/upload" element={<FileUpload />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
