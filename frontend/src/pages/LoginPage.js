import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InvalidLogin } from '../components/userMessages';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetLoginErrors = document.getElementById('loginError');
    resetLoginErrors.style.display = 'none';
    try {
      // Send a login request to the server
      const response = await axios.post(
        'http://localhost:3001/login',
        {
          email,
          password,
        },
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));

        navigate('/dashboard');
      } else {
        document.dispatchEvent(new CustomEvent('invalidLogin'));
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-screen-container">
      <div className="login-middle-div">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-form-field">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="login-input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
          </div>
          <div className="login-form-field"> 
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              className="login-input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        
          <button type="submit" className="login-login-btn">
            Login
          </button>
          <div className="login-error-box">
            <InvalidLogin />
          </div>
          <div className="login-no-account">
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="login-register-text-span"
              >
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
