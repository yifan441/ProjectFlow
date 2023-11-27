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
            { name: 'Task 1', id: 12, complete: false },
            { name: 'Task 2', id: 13, complete: false },
            { name: 'Task 3', id: 14, complete: false },
          ],
        },
        {
          name: 'List 2',
          id: 1.2,
          tasks: [{ name: 'Task 2', id: 13, complete: false }],
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
          tasks: [{ name: 'Task 1.2', id: 12, complete: false }],
        },
      ],
    },
  ];
  const [projects, setProjects] = useState(data); // array of all project objects
  const [selectedProject, setSelectedProject] = useState({ id: 'home', obj: null }); // currently selected project id + obj

  // updates array of projects
  function handleProjectAdd(newProjectObj) {
    setProjects([...projects, newProjectObj]);
  }

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

  function handleAddList(newListObj, projectId) {
    // TODO
    const newProjectsData = [...projects];
    const projectIndex = newProjectsData.findIndex((project) => project.id === projectId);
    if (projectIndex !== -1) {
      // check is probably unnecessary
      newProjectsData[projectIndex].lists.push(newListObj);
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
            listsData={selectedProject.obj.lists}
            projectName={selectedProject.obj.name}
            projectId={selectedProject.obj.id}
            handleAddList={handleAddList}
          />
        )}
      </div>
    </div>
  );
}
