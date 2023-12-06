import { useState, useEffect, useRef } from 'react';
import { RenameProject } from './Rename.js';
import { readPDFFile } from './readPDFFile.js';
import axios from 'axios';
import { ReorderProject } from '../components/Reorder';
import { DisplayLoadEvent } from './userMessages';
const { addIdToJsonString } = require('./jsonUtils');

export default function ProjectNavigationPanel({
  selectedProjectId,
  handleSelect,
  projects,
  handleProjectAdd,
  handleRenameProject,
  handleProjectDelete,
  handleMoveProject,
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);

  // updates inputValue to be user inputed value everytime a change is detected
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRemoveLoadEvent = () => {
    console.log('handleRemoveCalled');
    const loadMessage = document.getElementById('loadingPDF');
    loadMessage.style.display = 'none';
  };

  //updates the selected file if user clicks pdf file button multiple times
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // creates a new project object and adds it to list of projects
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') return;
    let newProjectObj = createProject(inputValue);
    handleProjectAdd(newProjectObj); // calls parent function
    setInputValue('');
  };

  const handleFileSubmit = async (file) => {
    //Trying to display loading messages when loading PDF but this code isn't executed"
    console.log('dispatching beginLoadingPDF');
    document.dispatchEvent(new CustomEvent('beginLoadingPDF'));
    try {
      const pdfText = await readPDFFile(file);
      try {
        const response = await axios.post('http://localhost:3001/autoProject', { pdfText });
        // console.log(response.data.result);
        const pdfData = addIdToJsonString(response.data.result);
        // console.log((JSON.stringify(pdfData)));
        handleProjectAdd(pdfData);
        handleRemoveLoadEvent();
      } catch (error) {
        console.log('Error with OpenAI Request.', error.message);
      }
    } catch (error) {
      console.error('Error reading PDF File:', error.message);
    }
  };

  // calls built-in file submit handling - will put parsing/other methods in this function.]
  const handleFileSubmitInternal = (e) => {
    e.preventDefault();
    if (selectedFile) {
      handleFileSubmit(selectedFile);
      setSelectedFile(null);
    }
  };

  const toggleFileInput = () => {
    setShowFileInput(!showFileInput);
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
    <div className="nav-panel-outer-div">
      <div className="nav-panel-header-div">
        <div
          className={'home' === selectedProjectId ? 'home actively-selected' : 'home'}
          onClick={() => handleSelect('home')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M6.25 15.9495C6.25 14.2523 6.25 13.4037 6.59308 12.6578C6.93615 11.9119 7.58046 11.3596 8.86906 10.2551L10.1191 9.18364C12.4482 7.18723 13.6128 6.18903 15 6.18903C16.3872 6.18903 17.5518 7.18723 19.8809 9.18364L21.1309 10.2551C22.4195 11.3596 23.0638 11.9119 23.4069 12.6578C23.75 13.4037 23.75 14.2523 23.75 15.9495V21.25C23.75 23.607 23.75 24.7855 23.0178 25.5178C22.2855 26.25 21.107 26.25 18.75 26.25H11.25C8.89298 26.25 7.71447 26.25 6.98223 25.5178C6.25 24.7855 6.25 23.607 6.25 21.25V15.9495Z"
              stroke="#626060"
              stroke-width="2"
            />
            <path
              d="M18.125 26.25V19.75C18.125 19.1977 17.6773 18.75 17.125 18.75H12.875C12.3227 18.75 11.875 19.1977 11.875 19.75V26.25"
              stroke="#626060"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Home</span>
        </div>
        <div className="new-project">
          <form action="" className="new-project-form" onSubmit={handleSubmit}>
            <button type="submit" className="btn-create" aria-label="create new project">
              +
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="New project"
              aria-label="New project"
            />
          </form>
        </div>

        <form action="" className="ai-new-project-form" onSubmit={handleSubmit}>
          <button
            onClick={toggleFileInput}
            className="btn-create-pdf"
            aria-label="create project from PDF"
          >
            Create Project from PDF
          </button>
          {showFileInput && (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                aria-label="Select PDF file"
              />
              <button
                onClick={handleFileSubmitInternal}
                className="btn-submit-pdf"
                aria-label="submit PDF"
              >
                Submit PDF
              </button>
            </>
          )}
        </form>
        <DisplayLoadEvent />
      </div>
      <span className="projects-span">Projects</span>
      <div className="project-list-div">
        <ul className="project-list" style={{ marginTop: '10px' }}>
          {projects.map((item) => (
            <li
              key={item.id}
              className={item.id === selectedProjectId ? 'actively-selected' : 'project-list-item'}
              onClick={() => handleSelect(item.id)}
            >
              <div
                className="project-div"
                style={{
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingLeft: '10px',
                }}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="10"
                    viewBox="0 0 8 10"
                    fill="none"
                    className="project-list-svg"
                  >
                    <path
                      d="M1 9L7 5L1 1"
                      stroke="#626060"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    className="project-list-svg"
                  >
                    <path
                      d="M10.4275 2.375H7.12504C5.63226 2.375 4.88587 2.375 4.42212 2.83875C3.95837 3.3025 3.95837 4.04889 3.95837 5.54167V13.4583C3.95837 14.9511 3.95837 15.6975 4.42212 16.1613C4.88587 16.625 5.63226 16.625 7.12504 16.625H11.875C13.3678 16.625 14.1142 16.625 14.578 16.1613C15.0417 15.6975 15.0417 14.9511 15.0417 13.4583V6.98917C15.0417 6.66558 15.0417 6.50378 14.9814 6.35829C14.9212 6.21281 14.8068 6.0984 14.578 5.86959L11.5471 2.83875C11.3183 2.60993 11.2039 2.49552 11.0584 2.43526C10.9129 2.375 10.7511 2.375 10.4275 2.375Z"
                      stroke="#626060"
                      stroke-width="1.5"
                    />
                    <path
                      d="M7.125 10.2917L11.875 10.2917"
                      stroke="#626060"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M7.125 13.4583L10.2917 13.4583"
                      stroke="#626060"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.2916 2.375V5.54167C10.2916 6.28806 10.2916 6.66125 10.5235 6.89313C10.7554 7.125 11.1286 7.125 11.875 7.125H15.0416"
                      stroke="#626060"
                      stroke-width="1.5"
                    />
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
                      width="24"
                      height="23"
                      viewBox="0 0 24 23"
                      fill="none"
                    >
                      <path
                        d="M8 11C8 12.1046 7.10457 13 6 13C4.89543 13 4 12.1046 4 11C4 9.89543 4.89543 9 6 9C7.10457 9 8 9.89543 8 11Z"
                        fill="#626060"
                      />
                      <path
                        d="M14 11C14 12.1046 13.1046 13 12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11Z"
                        fill="#626060"
                      />
                      <path
                        d="M20 11C20 12.1046 19.1046 13 18 13C16.8954 13 16 12.1046 16 11C16 9.89543 16.8954 9 18 9C19.1046 9 20 9.89543 20 11Z"
                        fill="#626060"
                      />
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
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="dropdown-menu-svg"
                              >
                                <mask
                                  id="path-1-outside-1_98_92"
                                  maskUnits="userSpaceOnUse"
                                  x="3"
                                  y="4"
                                  width="17"
                                  height="17"
                                  fill="black"
                                >
                                  <rect fill="white" x="3" y="4" width="17" height="17" />
                                  <path d="M13.5858 7.41421L6.39171 14.6083C6.19706 14.8029 6.09974 14.9003 6.03276 15.0186C5.96579 15.1368 5.93241 15.2704 5.86564 15.5374L5.20211 18.1915C5.11186 18.5526 5.06673 18.7331 5.16682 18.8332C5.2669 18.9333 5.44742 18.8881 5.80844 18.7979L5.80845 18.7979L8.46257 18.1344C8.72963 18.0676 8.86316 18.0342 8.98145 17.9672C9.09974 17.9003 9.19706 17.8029 9.39171 17.6083L16.5858 10.4142L16.5858 10.4142C17.2525 9.74755 17.5858 9.41421 17.5858 9C17.5858 8.58579 17.2525 8.25245 16.5858 7.58579L16.4142 7.41421C15.7475 6.74755 15.4142 6.41421 15 6.41421C14.5858 6.41421 14.2525 6.74755 13.5858 7.41421Z" />
                                </mask>
                                <path
                                  d="M6.39171 14.6083L7.45237 15.6689H7.45237L6.39171 14.6083ZM13.5858 7.41421L12.5251 6.35355L12.5251 6.35355L13.5858 7.41421ZM16.4142 7.41421L15.3536 8.47487L15.3536 8.47487L16.4142 7.41421ZM16.5858 7.58579L17.6464 6.52513L17.6464 6.52512L16.5858 7.58579ZM16.5858 10.4142L17.6464 11.4749L16.5858 10.4142ZM9.39171 17.6083L8.33105 16.5476L8.33105 16.5476L9.39171 17.6083ZM5.86564 15.5374L7.32086 15.9012V15.9012L5.86564 15.5374ZM5.20211 18.1915L3.7469 17.8277V17.8277L5.20211 18.1915ZM5.80845 18.7979L5.44465 17.3427L5.3793 17.359L5.31567 17.3811L5.80845 18.7979ZM8.46257 18.1344L8.09877 16.6791L8.09877 16.6791L8.46257 18.1344ZM5.16682 18.8332L6.22748 17.7725L6.22747 17.7725L5.16682 18.8332ZM5.80844 18.7979L6.17224 20.2531L6.2376 20.2368L6.30122 20.2146L5.80844 18.7979ZM8.98145 17.9672L8.2424 16.6619L8.2424 16.6619L8.98145 17.9672ZM16.5858 10.4142L17.6465 11.4749V11.4749L16.5858 10.4142ZM6.03276 15.0186L4.72746 14.2795L4.72746 14.2795L6.03276 15.0186ZM7.45237 15.6689L14.6464 8.47487L12.5251 6.35355L5.33105 13.5476L7.45237 15.6689ZM15.3536 8.47487L15.5251 8.64645L17.6464 6.52512L17.4749 6.35355L15.3536 8.47487ZM15.5251 9.35355L8.33105 16.5476L10.4524 18.6689L17.6464 11.4749L15.5251 9.35355ZM4.41043 15.1736L3.7469 17.8277L6.65733 18.5554L7.32086 15.9012L4.41043 15.1736ZM6.17226 20.2531L8.82638 19.5896L8.09877 16.6791L5.44465 17.3427L6.17226 20.2531ZM3.7469 17.8277C3.714 17.9593 3.6437 18.2241 3.62021 18.4642C3.59491 18.7228 3.57801 19.3657 4.10616 19.8938L6.22747 17.7725C6.42048 17.9655 6.53082 18.1949 6.57919 18.405C6.62109 18.587 6.60925 18.7226 6.60596 18.7563C6.60227 18.794 6.59821 18.8029 6.60886 18.7548C6.61898 18.7092 6.6333 18.6515 6.65733 18.5554L3.7469 17.8277ZM5.31567 17.3811L5.31566 17.3811L6.30122 20.2146L6.30123 20.2146L5.31567 17.3811ZM5.44465 17.3427C5.34853 17.3667 5.2908 17.381 5.24519 17.3911C5.19714 17.4018 5.20601 17.3977 5.24374 17.394C5.27744 17.3907 5.41297 17.3789 5.59501 17.4208C5.80513 17.4692 6.03447 17.5795 6.22748 17.7725L4.10615 19.8938C4.63429 20.422 5.27716 20.4051 5.53581 20.3798C5.77593 20.3563 6.04065 20.286 6.17224 20.2531L5.44465 17.3427ZM8.33105 16.5476C8.28079 16.5979 8.24426 16.6344 8.21273 16.6653C8.18146 16.6959 8.16438 16.7118 8.15517 16.7201C8.14674 16.7277 8.15246 16.722 8.16851 16.7099C8.18625 16.6967 8.21142 16.6795 8.2424 16.6619L9.7205 19.2725C10.0569 19.0821 10.314 18.8073 10.4524 18.6689L8.33105 16.5476ZM8.82637 19.5896C9.01618 19.5421 9.38407 19.463 9.7205 19.2725L8.2424 16.6619C8.27338 16.6444 8.30106 16.6316 8.32158 16.6233C8.34016 16.6157 8.34799 16.6137 8.33715 16.6171C8.32532 16.6207 8.30286 16.6271 8.26052 16.6382C8.21783 16.6494 8.16773 16.6619 8.09877 16.6791L8.82637 19.5896ZM15.5251 8.64645C15.6957 8.81706 15.8269 8.94839 15.9362 9.06332C16.046 9.17881 16.1078 9.25097 16.1433 9.29743C16.1781 9.34313 16.1624 9.33181 16.1388 9.27537C16.1103 9.20698 16.0858 9.10988 16.0858 9H19.0858C19.0858 8.33306 18.7968 7.82956 18.5283 7.47769C18.2863 7.16043 17.9498 6.82847 17.6464 6.52513L15.5251 8.64645ZM17.6464 11.4749L17.6465 11.4749L15.5251 9.35355L15.5251 9.35355L17.6464 11.4749ZM17.6465 11.4749C17.9498 11.1715 18.2863 10.8396 18.5283 10.5223C18.7968 10.1704 19.0858 9.66694 19.0858 9H16.0858C16.0858 8.89012 16.1103 8.79302 16.1388 8.72463C16.1624 8.66819 16.1781 8.65687 16.1433 8.70256C16.1078 8.74903 16.046 8.82119 15.9362 8.93667C15.8269 9.05161 15.6957 9.18294 15.5251 9.35355L17.6465 11.4749ZM14.6464 8.47487C14.8171 8.30426 14.9484 8.17307 15.0633 8.06379C15.1788 7.954 15.251 7.8922 15.2974 7.85675C15.3431 7.82188 15.3318 7.83762 15.2754 7.86116C15.207 7.88968 15.1099 7.91421 15 7.91421V4.91421C14.3331 4.91421 13.8296 5.20321 13.4777 5.47168C13.1604 5.71374 12.8285 6.0502 12.5251 6.35355L14.6464 8.47487ZM17.4749 6.35355C17.1715 6.0502 16.8396 5.71374 16.5223 5.47168C16.1704 5.20321 15.6669 4.91421 15 4.91421V7.91421C14.8901 7.91421 14.793 7.88968 14.7246 7.86116C14.6682 7.83762 14.6569 7.82188 14.7026 7.85675C14.749 7.8922 14.8212 7.954 14.9367 8.06379C15.0516 8.17307 15.1829 8.30426 15.3536 8.47487L17.4749 6.35355ZM5.33105 13.5476C5.19271 13.686 4.91795 13.9431 4.72746 14.2795L7.33806 15.7576C7.32052 15.7886 7.30335 15.8138 7.29005 15.8315C7.27802 15.8475 7.27232 15.8533 7.27991 15.8448C7.28818 15.8356 7.30412 15.8185 7.33473 15.7873C7.36561 15.7557 7.40211 15.7192 7.45237 15.6689L5.33105 13.5476ZM7.32086 15.9012C7.3381 15.8323 7.35064 15.7822 7.36179 15.7395C7.37285 15.6971 7.37931 15.6747 7.38294 15.6629C7.38627 15.652 7.3843 15.6598 7.37672 15.6784C7.36835 15.6989 7.35561 15.7266 7.33806 15.7576L4.72746 14.2795C4.53698 14.6159 4.45788 14.9838 4.41043 15.1736L7.32086 15.9012Z"
                                  fill="#626060"
                                  mask="url(#path-1-outside-1_98_92)"
                                />
                                <path
                                  d="M12.5 7.5L15.5 5.5L18.5 8.5L16.5 11.5L12.5 7.5Z"
                                  fill="#626060"
                                />
                              </svg>
                              <span>Rename</span>
                            </div>
                          </li>
                          <li
                            key="delete"
                            onClick={() => {
                              handleProjectDelete();
                              setIsDropDownOpen(!isDropdownOpen);
                            }}
                          >
                            <div>
                              {' '}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="23"
                                height="23"
                                viewBox="0 0 23 23"
                                fill="none"
                                className="dropdown-menu-svg"
                              >
                                <path
                                  d="M9.10413 13.8958L9.10413 11.0208"
                                  stroke="#D82323"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M13.8959 13.8958L13.8959 11.0208"
                                  stroke="#D82323"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M2.875 6.22916H20.125V6.22916C18.8591 6.22916 18.2262 6.22916 17.7567 6.50534C17.4637 6.67774 17.2194 6.92199 17.047 7.21502C16.7708 7.68448 16.7708 8.31743 16.7708 9.58332V14.6875C16.7708 16.5731 16.7708 17.5159 16.185 18.1017C15.5993 18.6875 14.6565 18.6875 12.7708 18.6875H10.2292C8.34355 18.6875 7.40074 18.6875 6.81495 18.1017C6.22917 17.5159 6.22917 16.5731 6.22917 14.6875V9.58332C6.22917 8.31743 6.22917 7.68448 5.95298 7.21502C5.78058 6.92199 5.53634 6.67774 5.2433 6.50534C4.77384 6.22916 4.1409 6.22916 2.875 6.22916V6.22916Z"
                                  stroke="#D82323"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                                <path
                                  d="M9.10421 3.35441C9.10421 3.35441 9.58337 2.39584 11.5 2.39584C13.4167 2.39584 13.8959 3.35418 13.8959 3.35418"
                                  stroke="#D82323"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                              </svg>
                              <span style={{ color: '#D82323' }}>Delete Project</span>
                            </div>
                          </li>
                          {/* Implementation of UP/DOWN reordering for projects*/}
                          <li key="move-up">
                            <div>
                              <button
                                key="up"
                                className="up-down-button"
                                onClick={() => {
                                  handleMoveProject(1);
                                }}
                              >
                                &#9650; {/*Unicode for up arrow*/}
                              </button>
                            </div>
                          </li>
                          <li key="move-down">
                            <div>
                              <button
                                className="up-down-button"
                                onClick={() => {
                                  handleMoveProject(0);
                                }}
                              >
                                &#9660; {/*Unicode for down arrow*/}
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
          <RenameProject
            handleRenameProject={handleRenameProject}
            selectedProjectId={selectedProjectId}
          />
        </ul>
      </div>
    </div>
  );
}
