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
              attributes: { complete: false, priority: 'none', dueDate: null },
            },
            {
              name: 'Task 2',
              id: 4,
              attributes: { complete: false, priority: 'none', dueDate: null },
            },
            {
              name: 'Task 3',
              id: 5,
              attributes: { complete: false, priority: 'none', dueDate: null },
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
              attributes: { complete: false, priority: 'none', dueDate: null },
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
              attributes: { complete: false, priority: 'none', dueDate: null },
            },
          ],
        },
      ],
    },
  ];

  const [projects, setProjects] = useState([]); // array of all project objects
  const [selectedProject, setSelectedProject] = useState({ id: 'home', obj: null, index: null }); // currently selected project id + obj
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
        setSelectedProject({ id: id, obj: null, index: null });
      } else {
        const newIndex = projects.findIndex((proj) => proj.id === id);
        const newSelectedProj = { ...projects[newIndex] };
        setSelectedProject({ id: id, obj: newSelectedProj, index: newIndex });
      }
    }
    else if (id === selectedProject.id){
      document.dispatchEvent(new CustomEvent('renameFlag'));
    }
  }

  // deletes a project
  function handleProjectDelete() {
    const newProjects = [...projects].filter((proj) => proj.id !== selectedProject.id);
    setProjects(newProjects);
    setSelectedProject({ id: 'home', obj: null, index: null });
    // TODO: add a window.alert('are you sure you want to delete the project?') security feature --> maybe type project name to delete
  }

  // adds a project
  function handleProjectAdd(newProjectObj) {
    setProjects([...projects, newProjectObj]); // TODO rewatch useState gotcha video, might have to use (prev) => {return [...prev, newProjectObj]}
  }

  // adds a list
  function handleAddList(newListObj, projectIndex) {
    const newProjectsData = [...projects];
    newProjectsData[projectIndex].lists.push(newListObj);
    setProjects(newProjectsData);
  }

  // adds a task
  function handleAddTask(newTaskObj, projectIndex, listIndex) {
    const newProjectsData = [...projects];
    newProjectsData[projectIndex].lists[listIndex].tasks.push(newTaskObj);
    setProjects(newProjectsData);
  }

  // updates task attributes
  function handleUpdateTaskAttributes(attributeType, newValue, projectIndex, listIndex, taskIndex) {
    const newProjectsData = [...projects];
    if (attributeType === 'complete') {
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex].attributes.complete =
        newValue;
    }
    if (attributeType === 'priority') {
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex].attributes.priority =
        newValue;
    }
    if (attributeType === 'dueDate') {
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex].attributes.dueDate = newValue;
    }
    setProjects(newProjectsData);
  }

  function handleRenameProject(newName, projectId){
    const newProjectsData = [...projects];
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    newProjectsData[projectIndex].name = newName;
    setProjects(newProjectsData);
  }

  return (
    <div className="outer-container-div">
      <div className="navbar-div">
        <ProjectNavigationPanel
          selectedProjectId={selectedProject.id}
          handleSelect={handleSelect}
          projects={projects}
          handleProjectAdd={handleProjectAdd}
          handleRenameProject={handleRenameProject}
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
            handleAddList={handleAddList}
            handleAddTask={handleAddTask}
            handleUpdateTaskAttributes={handleUpdateTaskAttributes}
            projectIndex={selectedProject.index}
            projectObj={selectedProject.obj}
          />
        )}
      </div>
    </div>
  );
}
