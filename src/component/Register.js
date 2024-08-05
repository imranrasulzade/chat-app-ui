import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import AccountService from '../services/AccountService';

function Register() {
  const navigate = useNavigate();
  const [signUpReq, setSignUpReq] = useState({
    userName: '',
    password: '',
    role: 'USER'
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpReq({ ...signUpReq, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await AccountService.signUp(signUpReq);
      console.log('Registration successful:', response.data);
      alert('Registration successful!');
      setTimeout(goToLogin, 500); // Navigate to login page after 0.5 seconds
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const goToLogin = () => {
    navigate('/'); 
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label>UserName:</label>
          <input
            type="text"
            name="userName"
            value={signUpReq.userName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={signUpReq.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Register</button>
        <br></br>
        <button className='login-button' onClick={goToLogin}>Login page</button>
      </form>
    </div>
  );
}

export default Register;
