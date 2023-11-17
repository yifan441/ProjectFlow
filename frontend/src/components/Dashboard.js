import '../styles/Dashboard.css';

export default function Dashboard() {
  return (
    <div className="container-div">
      <div className="navbar-div">
        <h1>Projects</h1>
        <p>Home</p>
        <ul>
          <li>Project 1</li>
          <li>Project 2</li>
          <li>Project 3</li>
        </ul>
        <button>+ project</button>
      </div>
      <div className="display-div">
        <h1>Project Name</h1>
        <button>+ list</button>
        <div id="list 1">
          <h3>List 1</h3>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
          <button>+ task</button>
        </div>
        <div id="list 2">
          <h3>List 2</h3>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
          <button>+ task</button>
        </div>
        <div id="list 3">
          <h3>List 3</h3>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
          </ul>
          <button>+ task</button>
        </div>
      </div>
    </div>
  );
}
