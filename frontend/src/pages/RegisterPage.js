import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PasswordSuitability from '../components/PasswordSuitability';
import { UserAlreadyExists } from '../components/userMessages';

function RegisterPage() {
  const [name, setName] = useState();
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetExistErrors = document.getElementById('userExists');
    resetExistErrors.style.display = 'none';
    const resetPwdErrors = document.getElementById('passwordMessage');
    resetPwdErrors.style.display = 'none';
    try {
      const response = await axios.post(
        'http://localhost:3001/register',
        {
          name,
          email,
          password,
        },
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );
      if (response.status === 201) {
        const { token, user } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        navigate('/dashboard');
      } else if (response.status === 409) {
        //User already exists
        console.log(response.data.message);
        document.dispatchEvent(new CustomEvent('existingUser'));
      }

      //code error for invalid password input
      else if (response.status === 403) {
        console.log('Dispatching Event');
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
    navigate('/login');
  };
  return (
    <div className="register-screen-container">
      <div className="register-middle-div">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="register-margin"> */}
              <div className="register-form-field">
                <label htmlFor="name"><strong>Name</strong></label>
              <input
                type="text"
                placeholder="Enter name"
                autoComplete="off"
                name="name"
                className="register-input-box"
                onChange={(e) => setName(e.target.value)}
              />
              </div>
          {/* </div> */}
          <div className="register-form-field">
            {/* <div className="register-margin"> */}
              <label htmlFor="email"><strong>Email</strong></label>
              <input
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                name="email"
                className="register-input-box"
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
              />
            {/* </div> */}
          </div>

          <div className="user-exist-error">
            <UserAlreadyExists />
          </div>

          <div className="register-form-field">
            {/* <div className="register-margin"> */}
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                className="register-input-box"
                onChange={(e) => setPassword(e.target.value)}
              />
            {/* </div> */}
          </div>

          <div className="invalid-password">
            <PasswordSuitability />
          </div>
          <div className="register-password-requirements">
            <label
              htmlFor="pwd_requirments"
              style={{ fontSize: '10px', opacity: '0.7', fontWeight: 'normal' }}
            >
              Password of at least 8 characters with:
              <ul>
                <li>1 Uppercase Character</li>
                <li>1 Lowercase Character</li>
                <li>1 Special Character</li>
                <li>1 Digit</li>
              </ul>
            </label>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>

          <div className="register-existing-account">
            <p>
              Already have an account?{' '}
              <span
                onClick={handleLogin}
                className="register-screen-text-span"
              >
                Log In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;
