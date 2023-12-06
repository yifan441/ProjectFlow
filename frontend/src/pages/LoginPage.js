import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Log In
          </button>
          <div className="login-error-box">
            <InvalidLogin />
          </div>
          <div className="mt-3 text-center">
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-primary cursor-pointer"
              >
                Register
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

