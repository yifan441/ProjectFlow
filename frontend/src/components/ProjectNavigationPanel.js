import { useState, useEffect, useRef } from 'react';
import { RenameProject } from './Rename.js';
import '../styles/ProjectNavigationPanel.css';

export default function ProjectNavigationPanel({
  selectedProjectId,
  handleSelect,
  projects,
  handleProjectAdd,
  handleRenameProject,
  handleProjectDelete,
}) {
  const [inputValue, setInputValue] = useState(''); // input value for "new project" text field
  const [isDropdownOpen, setIsDropDownOpen] = useState('false');
  const dropDownSvgRef = useRef();
  const dropDownRef = useRef();

  useEffect(() => {
    const closeDropDown = (e) => {
      if (e.target !== dropDownRef.current && e.target !== dropDownSvgRef.current) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener('click', closeDropDown);

    return () => {
      document.removeEventListener('click', closeDropDown);
    };
  });

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
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {projects.map((item) => (
            <li
              key={item.id}
              className={item.id === selectedProjectId ? 'active-project' : 'project-list-item'}
              onClick={() => handleSelect(item.id)}
              style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                {item.name}
              </span>
              {item.id === selectedProjectId && (
                <div className="navbar-more-actions-div">
                  <svg
                    className="navbar-more-actions-svg"
                    onClick={() => setIsDropDownOpen(!isDropdownOpen)}
                    ref={dropDownSvgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  >
                    <circle cx="2.5" cy="8" r=".75" /> <circle cx="8" cy="8" r=".75" />
                    <circle cx="13.5" cy="8" r=".75" />
                  </svg>
                  {isDropdownOpen && (
                    <div className="navbar-dropdown-menu" ref={dropDownRef}>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        <li
                          key="rename"
                          onClick={() => {
                            document.dispatchEvent(new CustomEvent('renameFlag'));
                            setIsDropDownOpen(!isDropdownOpen);
                          }}
                        >
                          Rename
                        </li>
                        <li
                          key="delete"
                          onClick={() => {
                            handleProjectDelete();
                            setIsDropDownOpen(!isDropdownOpen);
                          }}
                        >
                          Delete Project
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
          <RenameProject
            handleRenameProject={handleRenameProject}
            selectedProjectId={selectedProjectId}
          />
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
