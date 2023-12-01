import Calendar from './Calendar';

export default function Home({ projectsData }) {
  return (
    <div>
      <h1>Home Page</h1>
      <br />
      <hr />
      <br />
      <Calendar projectsData={projectsData} />
    </div>
  );
}
