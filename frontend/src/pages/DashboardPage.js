import '../styles/Dashboard.css';
import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import ProjectNavigationPanel from '../components/ProjectNavigationPanel';
import ProjectDashboard from '../components/ProjectDashboard';
import Home from '../components/Home';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // visual representation of an example of a possible user data array
  let dummyUserData = [
    {
      name: 'Project 1',
      id: 1,
      lists: [
        {
          name: 'List 1',
          id: 2,
          tasks: [
            {
              name: 'Task 1',
              id: 3,
              complete: false,
              attributes: { priority: 'none', dueDate: null },
            },
            {
              name: 'Task 2',
              id: 4,
              complete: false,
              attributes: { priority: 'none', dueDate: null },
            },
            {
              name: 'Task 3',
              id: 5,
              complete: false,
              attributes: { priority: 'none', dueDate: null },
            },
          ],
        },
        {
          name: 'List 2',
          id: 6,
          tasks: [
            {
              name: 'Task 2',
              id: 7,
              complete: false,
              attributes: { priority: 'none', dueDate: null },
            },
          ],
        },
      ],
    },
    {
      name: 'Project 2',
      id: 8,
      lists: [
        {
          name: 'List 1',
          id: 9,
          tasks: [
            {
              name: 'Task 1.2',
              id: 10,
              complete: false,
              attributes: { priority: 'none', dueDate: null },
            },
          ],
        },
      ],
    },
  ];

  const [projects, setProjects] = useState([]); // array of all project objects
  const [selectedProject, setSelectedProject] = useState({ id: 'home', obj: null }); // currently selected project id + obj
  const [loading, setLoading] = useState(true);

  // requests data from backend on mount
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('User is not logged in');
          return;
        }

        const response = await axios.get('http://localhost:3001/user/dashboard', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status === 200) {
          console.log('retrieved dashboard');
          setProjects(response.data.dashboard);
        } else {
          console.error('Error fetching user dashboard:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [navigate]);

  // sends updated data to backend everytime projects variable changes
  useEffect(() => {
    async function updateBackend() {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('User is not logged in');
          return;
        }
        const copy = projects;
        const updatedProjectData = JSON.stringify(copy);

        const response = await axios.post(
          'http://localhost:3001/user/updateDashboard',
          {
            updatedProjectData,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          console.log('Updated info sent to backend');
          // Optionally, you can handle success if needed
        } else {
          console.error('Error updating user dashboard:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating user dashboard:', error);
      }
    }
    updateBackend();
  }, [projects, navigate]);

  // render loading screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/');
    console.log('User logged out');
  };

  // updates selectedProject
  function handleSelect(id) {
    if (id !== selectedProject.id) {
      if (id === 'home') {
        setSelectedProject({ id: id, obj: null });
      } else {
        const newSelectedProj = projects.find((proj) => proj.id === id);
        setSelectedProject({ id: id, obj: newSelectedProj });
      }
    }
  }

  // deletes a project
  function handleProjectDelete() {
    const newProjects = [...projects].filter((proj) => proj.id !== selectedProject.id);
    setProjects(newProjects);
    setSelectedProject({ id: 'home', obj: null });
    // TODO: add a window.alert('are you sure you want to delete the project?') security feature --> maybe type project name to delete
  }

  // adds a project
  function handleProjectAdd(newProjectObj) {
    setProjects([...projects, newProjectObj]); // TODO rewatch useState gotcha video, might have to use (prev) => {return [...prev, newProjectObj]}
  }

  // adds a list
  function handleAddList(newListObj, projectId) {
    const newProjectsData = [...projects];
    const projectIndex = getProjectIndex(newProjectsData, projectId);
    if (projectIndex !== -1) {
      // check is probably unnecessary
      newProjectsData[projectIndex].lists.push(newListObj);
      setProjects(newProjectsData);
    }
  }

  // adds a task
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

  return (
    <div className="outer-container-div">
      <div className="navbar-div">
        <ProjectNavigationPanel
          selectedProjectId={selectedProject.id}
          handleSelect={handleSelect}
          projects={projects}
          handleProjectAdd={handleProjectAdd}
        />
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="display-div">
        {selectedProject.id === 'home' ? (
          <Home projectsData={projects} />
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
