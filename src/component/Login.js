import React, { useState } from 'react';
// import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import AccountService from '../services/AccountService';


function Login() {
  const navigate = useNavigate();
  const [loginReq, setLoginReq] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginReq({ ...loginReq, [name]: value });
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const goToAdminDashboard = () => {
    navigate('/admin');
  };

  const goToChats = () => {
    navigate('/chat');
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AccountService.signIn(loginReq);
      const { token } = response.data;
      const { userName } = response.data.user;
      const { id } = response.data.user;
      localStorage.setItem('token', token); 
      localStorage.setItem('username', userName);
      localStorage.setItem('id', id); 
     
      if(response.data.user.role.name === 'USER'){
        goToChats();
      }else if(response.data.user.role.name === 'ADMIN'){
        goToAdminDashboard();
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>UserName:</label>
          <input type="text" name="userName" value={loginReq.userName} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={loginReq.password} onChange={handleInputChange} required />
        </div>
        <button type="submit">Login</button>

      </form>
      <br></br>
      <button className='register-button' onClick={goToRegister}>Create new account</button>
      
    </div>
  );
}

export default Login;
