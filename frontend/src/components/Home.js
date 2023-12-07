import Calendar from './Calendar';

export default function Home({ projectsData, username }) {
  return (
    <div className="home-containing-div">
      <div className="color-block"></div>
      <div className="home-header-div">
        <div className="home-welcome-text-div">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
          >
            <path
              d="M43.1248 22.9999C43.1248 11.8852 34.1145 2.87491 22.9998 2.87491C11.885 2.87491 2.87476 11.8852 2.87476 22.9999C2.87476 26.6431 3.84283 30.0602 5.53577 33.008C4.66471 35.2854 3.84207 37.9311 3.30195 40.575C3.04436 41.8359 4.15538 42.9028 5.40767 42.6063C7.94014 42.0065 10.5109 41.1752 12.769 40.334C15.7667 42.1073 19.2645 43.1249 22.9998 43.1249C34.1145 43.1249 43.1248 34.1147 43.1248 22.9999Z"
              fill="#F6E797"
            />
            <path
              d="M15.3334 28.7499C18.6875 33.861 27.3125 33.861 30.6667 28.7499"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.2914 16.2916V18.2083"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M29.7081 16.2916V18.2083"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M43.1248 22.9999C43.1248 11.8852 34.1145 2.87491 22.9998 2.87491C11.885 2.87491 2.87476 11.8852 2.87476 22.9999C2.87476 26.6431 3.84283 30.0602 5.53577 33.008C4.66471 35.2854 3.84207 37.9311 3.30195 40.575C3.04436 41.8359 4.15538 42.9028 5.40767 42.6063C7.94014 42.0065 10.5109 41.1752 12.769 40.334C15.7667 42.1073 19.2645 43.1249 22.9998 43.1249C34.1145 43.1249 43.1248 34.1147 43.1248 22.9999Z"
              stroke="black"
              stroke-width="3"
              stroke-linejoin="round"
            />
          </svg>
          Hi {username}!
        </div>
        <div className="calendar-icon-label">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="home-calendar-svg"
          >
            <rect x="3" y="6" width="18" height="15" rx="2" stroke="#7D7C78" stroke-width="2" />
            <path
              d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z"
              fill="#7D7C78"
            />
            <path d="M7 3L7 6" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
            <path d="M17 3L17 6" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
          </svg>
          Calendar
        </div>
      </div>
      <Calendar projectsData={projectsData} />
    </div>
  );
}
