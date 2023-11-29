import { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

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
          navigate('/dashboard');
        } else if (response.status === 409) {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
  };

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
