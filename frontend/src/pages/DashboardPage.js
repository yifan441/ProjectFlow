import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import ProjectNavigationPanel from '../components/ProjectNavigationPanel';
import ProjectDashboard from '../components/ProjectDashboard';
import Home from '../components/Home';

export default function Dashboard() {
  // placeholder dummy data
  let userData = [
    {
      name: 'Project 1',
      id: 1,
      lists: [
        {
          name: 'List 1',
          id: 1.1,
          tasks: [
            { name: 'Task 1', id: 12, complete: false, attributes: {} },
            { name: 'Task 2', id: 13, complete: false, attributes: {} },
            { name: 'Task 3', id: 14, complete: false, attributes: {} },
          ],
        },
        {
          name: 'List 2',
          id: 1.2,
          tasks: [{ name: 'Task 2', id: 13, complete: false, attributes: {} }],
        },
      ],
    },
    {
      name: 'Project 2',
      id: 2,
      lists: [
        {
          name: 'List 1',
          id: 1.1,
          tasks: [{ name: 'Task 1.2', id: 12, complete: false, attributes: {} }],
        },
      ],
    },
  ];

  const [projects, setProjects] = useState(userData); // array of all project objects
  const [selectedProject, setSelectedProject] = useState({ id: 'home', obj: null }); // currently selected project id + obj

  // TODO VIK: get projects data from backend when Dashboard loads for the very first time only
  useEffect(() => {
    // code to fetch array from backend
    // setProjects(ARRAY RECIEVED FROM BACKEND);
  }, []);

  // updates selectedProject
  function handleSelect(id) {
    if (id !== selectedProject.id) {
      const newSelectedProj = projects.find((proj) => proj.id === id);
      setSelectedProject({ id: id, obj: newSelectedProj });
    }
  }

  // deletes a project
  function handleProjectDelete() {
    const newProjects = [...projects].filter((proj) => proj.id !== selectedProject.id);
    setProjects(newProjects);
    setSelectedProject({ id: 'home', obj: null });
    // TODO: add a window.alert('are you sure you want to delete the project?') security feature --> maybe type project name to delete
  }

  // updates array of projects
  function handleProjectAdd(newProjectObj) {
    setProjects([...projects, newProjectObj]); // TODO rewatch useState gotcha video, might have to use (prev) => {return [...prev, newProjectObj]}
  }

  function handleAddList(newListObj, projectId) {
    const newProjectsData = [...projects];
    const projectIndex = getProjectIndex(newProjectsData, projectId);
    if (projectIndex !== -1) {
      // check is probably unnecessary
      newProjectsData[projectIndex].lists.push(newListObj);
      setProjects(newProjectsData);
    }
  }

  function handleAddTask(newTaskObj, projectId, listId) {
    const newProjectsData = [...projects];
    const projectIndex = getProjectIndex(newProjectsData, projectId);
    const listIndex = getListIndex(newProjectsData, projectId, listId);
    if (listIndex !== -1) {
      // check is probably unnecessary
      newProjectsData[projectIndex].lists[listIndex].tasks.push(newTaskObj);
      setProjects(newProjectsData);
    }
  }

  // TO DO: VIK
  // sends updated projects array to backend (send selectedProject as well????? idk haven't decided yet)
  function updateBackend() {
    const copy = projects;
    const updatedProjectData = JSON.stringify(copy);
    // SEND updatedProjectData TO BACKEND TO UPDATE PREVIOUSLY STORED STRING
    console.log('updated info sent to backend');
  }

  // automatically calls updateBackend() when the state "projects" is changed
  // BUG: automatically runs once when component first renders...
  useEffect(() => {
    updateBackend();
  }, [projects]);

  return (
    <div className="outer-container-div">
      <div className="navbar-div">
        <ProjectNavigationPanel
          selectedProjectId={selectedProject.id}
          handleSelect={handleSelect}
          projects={projects}
          handleProjectAdd={handleProjectAdd}
        />
      </div>
      <div className="display-div">
        {selectedProject.id === 'home' ? (
          <Home />
        ) : (
          <ProjectDashboard
            handleProjectDelete={handleProjectDelete}
            listsArray={selectedProject.obj.lists}
            projectName={selectedProject.obj.name}
            projectId={selectedProject.obj.id}
            handleAddList={handleAddList}
            handleAddTask={handleAddTask}
          />
        )}
      </div>
    </div>
  );

  // Utility Functions

  function getProjectIndex(projectsArray, projectId) {
    return projectsArray.findIndex((project) => project.id === projectId);
  }

  function getListIndex(projectsArray, projectId, listId) {
    const projectIndex = projectsArray.findIndex((project) => project.id === projectId);
    return projectsArray[projectIndex].lists.findIndex((list) => list.id === listId);
  }
}
