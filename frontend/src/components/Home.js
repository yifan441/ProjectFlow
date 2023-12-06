import Calendar from './Calendar';

export default function Home({ projectsData, username }) {
  return (
    <div>
      <div className="color-block"></div>
      <h1>Home Page</h1>
      <span>Welcome {username}!</span>
      <br />
      <hr />
      <br />
      <Calendar projectsData={projectsData} />
    </div>
  );
}
