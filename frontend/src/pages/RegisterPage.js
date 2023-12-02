import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordSuitability from '../components/PasswordSuitability';

function RegisterPage() {
  const [name, setName] = useState();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3001/register', {
          name,
          email,
          password,
        }, {
          validateStatus:(status) => status >= 200 && status < 500,
        });
        if (response.status === 201) {
          const { token, user } = response.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
          navigate('/dashboard');
        } else if (response.status === 409) {
          console.log(response.data.message);
        } 

        //code error for invalid password input
        else if (response.status === 403) {
          console.log("Dispatching Event");
          document.dispatchEvent(new CustomEvent('unsuitablePassword'));
          console.log(response.data.message);
        }
        //end addition - delete when merge
        
      } catch (error) {
        console.error('Error during registration:', error);
      }
  };

  //function should be defined separately in a different location --> probably can be removed.
  function handleUnsuitablePassword() {
    var passwordMessage = document.getElementById('passwordMessage');
    passwordMessage.style.display = 'block';
  }

  const handleLogin = () => {
    navigate ("/");
  }
  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <PasswordSuitability />
          <div className="mb-3">
            <label htmlFor="pwd_requirments" style={{ fontSize: '10px', opacity: '0.7', fontWeight: 'normal' }}>
              Password of at least 8 characters with:<br /> 1 Uppercase Character<br /> 1 Lowercase Character<br /> 1 Special Character
            </label>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
          <button
           onClick={handleLogin}
           className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
           >
            Already Have An Account? Log In
          </button>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;
