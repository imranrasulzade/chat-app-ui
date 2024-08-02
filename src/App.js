import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './component/ChatRoom';
import FileUpload from './component/FileUpload';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/chat" element={<ChatRoom />} />
                    <Route path="/upload" element={<FileUpload />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
