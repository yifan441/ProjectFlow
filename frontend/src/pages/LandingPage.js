import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleSignUp() {
    navigate('/register');
  }

  return (
    <div className="landing-page-container d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="landing-middle-div bg-white ">
        <h2>
          Welcome to{'  '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
          >
            <path
              d="M23 7.85034L25.1425 20.8576L38.1497 23L25.1425 25.1425L23 38.1497L20.8575 25.1425L7.8503 23L20.8575 20.8576L23 7.85034Z"
              fill="#4A68B4"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M23 43.4444C35.3983 43.4444 43.4444 35.3983 43.4444 23C43.4444 10.6017 35.3983 2.55556 23 2.55556C10.6017 2.55556 2.55556 10.6017 2.55556 23C2.55556 35.3983 10.6017 43.4444 23 43.4444ZM23 46C35.7026 46 46 35.7026 46 23C46 10.2975 35.7026 0 23 0C10.2975 0 0 10.2975 0 23C0 35.7026 10.2975 46 23 46Z"
              fill="#4A68B4"
            />
          </svg>
          ProjectFlow
        </h2>
        <div>
          <span>maximize your productivity</span>
        </div>
        <button
          type="submit"
          className="landing-login-btn btn btn-success w-100 rounded-0"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          type="submit"
          className="landing-sign-up-btn btn btn-success w-100 rounded-0"
          onClick={handleSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
