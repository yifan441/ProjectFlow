import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import ProjectNavigationPanel from '../components/ProjectNavigationPanel';
import ProjectDashboard from '../components/ProjectDashboard';
import Home from '../components/Home';

export default function Dashboard() {
  // TODO: get "data" from backend --> will end up being something like data.projects
  // placeholder dummy data
  let data = [
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
  const [projects, setProjects] = useState(data); // array of all project objects
  const [selectedProject, setSelectedProject] = useState({ id: 'home', obj: null }); // currently selected project id + obj

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
    setProjects([...projects, newProjectObj]);
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
    // TODO
    const newProjectsData = [...projects];
    const projectIndex = getProjectIndex(newProjectsData, projectId);
    const listIndex = getListIndex(newProjectsData, projectId, listId);
    if (listIndex !== -1) {
      // check is probably unnecessary
      newProjectsData[projectIndex].lists[listIndex].tasks.push(newTaskObj);
      setProjects(newProjectsData);
    }
  }

  // sends updated projects array to backend (send selectedProject as well?????)
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
