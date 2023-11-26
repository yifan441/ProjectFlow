import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  // GET "data" FROM BACKEND --> will end up being something like data.projects
  let data = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
  ];
  const [projects, setProjects] = useState(data); // array of all project objects
  const [inputValue, setInputValue] = useState(''); // input value for "Add a project" text field
  const [selectedProjectId, setSelectedProjectId] = useState('home'); // project id that is currently selected

  // updates inputValue to be user inputted value everytime a change is detected
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  // creates a new project object and adds it to list of projects
  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue === '') return;
    let newProjectObj = createProject(inputValue);
    setProjects([...projects, newProjectObj]);
    setInputValue('');
  };

  // creates and returns a new project object
  function createProject(projectName) {
    return {
      id: Date.now().toString(),
      name: projectName,
      tasks: [],
    };
  }

  // sends updated projects array to backend (send selectedProjectId as well?????)
  function updateBackend() {
    // TO DO
    // have this function take a argument that gets sent to BE to allow them to differentiate what info FE is sending?
    // e.g. updating projects vs. lists vs. tasks etc.
    // would have to think about cuz I can't hard code it if useEffect() is calling it instead of me
    console.log('updated info sent to backend');
  }

  // automatically calls updateBackend() when the state "projects" is changed
  // BUG: automatically runs once when component first renders...
  useEffect(() => {
    updateBackend();
  }, [projects]);

  // updates selectedProjectId
  function handleSelect(id) {
    if (id !== selectedProjectId) {
      setSelectedProjectId(id);
    }
  }

  // deletes a project
  function handleProjectDelete() {
    const newProjects = [...projects].filter((proj) => proj.id !== selectedProjectId);
    setProjects(newProjects);
    setSelectedProjectId('home'); // set it to null instead?
  }

  return (
    <div className="outer-container-div">
      <div className="navbar-div">
        <h1>Projects</h1>
        <p
          className={'home' === selectedProjectId ? 'active-project' : 'home'}
          onClick={() => handleSelect('home')}
        >
          Home
        </p>
        <div className="project-list-div">
          <ul>
            {projects.map((item) => (
              <li
                key={item.id}
                className={item.id === selectedProjectId ? 'active-project' : 'project-list-item'}
                onClick={() => handleSelect(item.id)}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <form action="" className="new-project-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="New project"
              aria-label="New project"
            ></input>
            <button type="submit" className="btn-create" aria-label="create new project">
              +
            </button>
          </form>
        </div>
      </div>
      <div className="display-div">
        <h1>Project Name</h1>
        <button onClick={handleProjectDelete}> delete project</button>
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
