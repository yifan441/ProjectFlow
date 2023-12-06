import { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import ProjectNavigationPanel from '../components/ProjectNavigationPanel';
import ProjectDashboard from '../components/ProjectDashboard';
import Home from '../components/Home';
import { useNavigate } from 'react-router-dom';
import { Reorder, deepCopyArray, deepCopyObject } from '../components/Reorder';

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
  const [username, setUsername] = useState('');

  // requests data from backend on mount
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('User is not logged in');
          navigate('/');
          return;
        }

        const response = await axios.get('http://localhost:3001/user/dashboard', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status === 200) {
          console.log('retrieved dashboard');
          const userName = response.data.name;
          // HERE IS UR USERNAME
          setUsername(userName);
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
          navigate('/');
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
          if (localStorage.getItem('authToken')) {
            handleLogout();
          } else {
            navigate('/');
          }
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
  }

  // deletes a project
  function handleProjectDelete() {
    const newProjects = [...projects].filter((proj) => proj.id !== selectedProject.id);
    setProjects(newProjects);
    setSelectedProject({ id: 'home', obj: null, index: null });
    // TODO: add a window.alert('are you sure you want to delete the project?') security feature --> maybe type project name to delete
  }

  // deletes a list
  function handleListDelete(projectIndex, listIndex) {
    const newProjects = [...projects];
    newProjects[projectIndex].lists.splice(listIndex, 1);
    setProjects(newProjects);
  }

  // deletes a task
  function handleTaskDelete(projectIndex, listIndex, taskIndex) {
    const newProjects = [...projects];
    newProjects[projectIndex].lists[listIndex].tasks.splice(taskIndex, 1);
    setProjects(newProjects);
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
    console.log(`projectIndex: ${projectIndex}, listIndex: ${listIndex}, taskIndex: ${taskIndex}`);
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

  function handleRenameProject(newName, projectId) {
    const newProjectsData = [...projects];
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    newProjectsData[projectIndex].name = newName;
    setProjects(newProjectsData);
    setSelectedProject((prevState) => {
      return { ...prevState, obj: newProjectsData[projectIndex] };
    });
  }

  function handleRenameList(newName, projectId, listId) {
    const newProjectsData = [...projects];
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    const listIndex = projects[projectIndex].lists.findIndex((list) => list.id === listId);
    newProjectsData[projectIndex].lists[listIndex].name = newName;
    setProjects(newProjectsData);
  }

  function handleRenameTask(newName, projectId, listId, taskId) {
    const newProjectsData = [...projects];
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    const listIndex = projects[projectIndex].lists.findIndex((list) => list.id === listId);
    const taskIndex = projects[projectIndex].lists[listIndex].tasks.findIndex(
      (task) => task.id === taskId
    );
    newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex].name = newName;
    setProjects(newProjectsData);
  }

  function handleMoveProject(moveDir) {
    const newProjectsData = deepCopyArray(projects);
    const projectIndex = projects.findIndex((proj) => proj.id === selectedProject.id);

    //moveDir = 1 means move up
    if (moveDir === 1 && projectIndex > 0) {
      const projectAtIndex = deepCopyObject(newProjectsData[projectIndex]);
      const projectAbove = deepCopyObject(newProjectsData[projectIndex - 1]);
      newProjectsData[projectIndex - 1] = projectAtIndex;
      newProjectsData[projectIndex] = projectAbove;
      setProjects(newProjectsData);
    }

    //moveDir = 0 means move down
    else if (moveDir === 0 && projectIndex < projects.length - 1) {
      const projectAtIndex = deepCopyObject(newProjectsData[projectIndex]);
      const projectBelow = deepCopyObject(newProjectsData[projectIndex + 1]);
      newProjectsData[projectIndex + 1] = projectAtIndex;
      newProjectsData[projectIndex] = projectBelow;
      setProjects(newProjectsData);
    }
    setProjects(newProjectsData);
  }

  function handleMoveList(moveDir, projectId, listId) {
    console.log('List Move Attempt');
    const newProjectsData = deepCopyArray(projects);
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    const listIndex = projects[projectIndex].lists.findIndex((list) => list.id === listId);

    //moveDir = 1 means move up
    console.log('projectIndex is: ', projectIndex);
    console.log('listIndex is: ', listIndex);

    console.log('Attempt to enter move up');
    if (moveDir === 1 && listIndex > 0) {
      console.log('Entered move up');
      const listAtIndex = deepCopyObject(newProjectsData[projectIndex].lists[listIndex]);
      const listAbove = deepCopyObject(newProjectsData[projectIndex].lists[listIndex - 1]);
      newProjectsData[projectIndex].lists[listIndex - 1] = listAtIndex;
      newProjectsData[projectIndex].lists[listIndex] = listAbove;
      setProjects(newProjectsData);
      setSelectedProject((prevState) => {
        return { ...prevState, obj: newProjectsData[projectIndex] };
      });
    }

    //moveDir = 0 means move down
    else if (moveDir === 0 && listIndex < projects[projectIndex].lists.length - 1) {
      console.log('Entered move down');
      const listAtIndex = deepCopyObject(newProjectsData[projectIndex].lists[listIndex]);
      const listBelow = deepCopyObject(newProjectsData[projectIndex].lists[listIndex + 1]);
      newProjectsData[projectIndex].lists[listIndex + 1] = listAtIndex;
      newProjectsData[projectIndex].lists[listIndex] = listBelow;
      setProjects(newProjectsData);
      setSelectedProject((prevState) => {
        return { ...prevState, obj: newProjectsData[projectIndex] };
      });
    }
    setProjects(newProjectsData);
  }

  function handleMoveTask(moveDir, projectId, listId, taskId) {
    console.log('Task Move Attempt');
    const newProjectsData = deepCopyArray(projects);
    const projectIndex = projects.findIndex((proj) => proj.id === projectId);
    const listIndex = projects[projectIndex].lists.findIndex((list) => list.id === listId);
    const taskIndex = projects[projectIndex].lists[listIndex].tasks.findIndex(
      (task) => task.id === taskId
    );

    //moveDir = 1 means move up
    console.log('projectIndex is: ', projectIndex);
    console.log('listIndex is: ', listIndex);
    console.log('taskIndex is: ', taskIndex);

    console.log('Attempt to enter move up');
    if (moveDir === 1 && taskIndex > 0) {
      console.log('Entered move up');
      const taskAtIndex = deepCopyObject(
        newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex]
      );
      const taskAbove = deepCopyObject(
        newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex - 1]
      );
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex - 1] = taskAtIndex;
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex] = taskAbove;
      setProjects(newProjectsData);
      setSelectedProject((prevState) => {
        return { ...prevState, obj: newProjectsData[projectIndex] };
      });
    }

    //moveDir = 0 means move down
    else if (moveDir === 0 && taskIndex < projects[projectIndex].lists[listIndex].tasks.length - 1) {
      console.log('Entered move down');
      const taskAtIndex = deepCopyObject(
        newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex]
      );
      const taskBelow = deepCopyObject(
        newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex + 1]
      );
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex + 1] = taskAtIndex;
      newProjectsData[projectIndex].lists[listIndex].tasks[taskIndex] = taskBelow;
      setProjects(newProjectsData);
      setSelectedProject((prevState) => {
        return { ...prevState, obj: newProjectsData[projectIndex] };
      });
    }
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
          handleProjectDelete={handleProjectDelete}
          handleMoveProject={handleMoveProject}
        />
        <div className="logout-div">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="display-div">
        {selectedProject.id === 'home' ? (
          <Home projectsData={projects} username={username} />
        ) : (
          <ProjectDashboard
            handleAddList={handleAddList}
            handleAddTask={handleAddTask}
            handleUpdateTaskAttributes={handleUpdateTaskAttributes}
            projectIndex={selectedProject.index}
            projectObj={selectedProject.obj}
            handleListDelete={handleListDelete}
            handleTaskDelete={handleTaskDelete}
            handleRenameList={handleRenameList}
            selectedProjectId={selectedProject.id}
            handleRenameTask={handleRenameTask}
            handleMoveList={handleMoveList}
            handleMoveTask={handleMoveTask}
          />
        )}
      </div>
    </div>
  );
}
