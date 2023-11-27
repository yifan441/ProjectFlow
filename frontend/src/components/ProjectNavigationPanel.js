import { useState, useEffect } from 'react';

export default function ProjectNavigationPanel({
  selectedProjectId,
  handleSelect,
  projects,
  handleProjectAdd,
}) {
  const [inputValue, setInputValue] = useState(''); // input value for "new project" text field

  // updates inputValue to be user inputed value everytime a change is detected
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // creates a new project object and adds it to list of projects
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') return;
    let newProjectObj = createProject(inputValue);
    handleProjectAdd(newProjectObj); // calls parent function
    setInputValue('');
  };

  // creates and returns a new project object
  function createProject(projectName) {
    return {
      id: Date.now().toString(),
      name: projectName,
      lists: [],
    };
  }

  return (
    <>
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
          />
          <button type="submit" className="btn-create" aria-label="create new project">
            +
          </button>
        </form>
      </div>
    </>
  );
}
