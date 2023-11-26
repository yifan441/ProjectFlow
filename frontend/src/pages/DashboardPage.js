import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import ProjectNavigationPanel from '../components/ProjectNavigationPanel';

export default function Dashboard() {
  // GET "data" FROM BACKEND --> will end up being something like data.projects
  let data = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
  ];
  const [projects, setProjects] = useState(data); // array of all project objects
  const [selectedProjectId, setSelectedProjectId] = useState('home'); // project id that is currently selected

  // updates array of projects
  function handleProjectAdd(newProjectObj) {
    setProjects([...projects, newProjectObj]);
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
        <ProjectNavigationPanel
          selectedProjectId={selectedProjectId}
          handleSelect={handleSelect}
          projects={projects}
          handleProjectAdd={handleProjectAdd}
        />
      </div>
      <div className="outer-display-div">
        <div className="inner-display-div">
          <h1>Project Name</h1>
          <button onClick={handleProjectDelete}> delete project</button>
          <button>+ list</button>
          <div id="list 1">
            <div className="list-header">
              <h3 className="list-title">List 1</h3>
              <p className="task-count">3 tasks remaining</p>
            </div>
            <div className="list-body">
              <div className="tasks-div">
                <div className="task">
                  <input type="checkbox" id="task-1" />
                  <label for="task-1">
                    <span class="custom-checkbox"></span>
                    task 1
                  </label>
                </div>
                <div className="task">
                  <input type="checkbox" id="task-1" />
                  <label for="task-1">
                    <span class="custom-checkbox"></span>
                    task 2
                  </label>
                </div>
                <div className="task">
                  <input type="checkbox" id="task-1" />
                  <label for="task-1">
                    <span class="custom-checkbox"></span>
                    task 3
                  </label>
                </div>
              </div>
            </div>
            <div className="new-task-creator">
              <form action="">
                <input type="text" placeholder="new task name" aria-label="new task name" />
                <button aria-label="create new task">+</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
