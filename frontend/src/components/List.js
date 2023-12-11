import { useState, useEffect, useRef } from 'react';
import { RenameList } from './Rename';
import Task from './Task';

export default function List({
  listObj,
  handleAddTask,
  projectIndex,
  listIndex,
  handleUpdateTaskAttributes,
  handleListDelete,
  handleTaskDelete,
  handleRenameList,
  selectedProjectId,
  selectedListId,
  handleRenameTask,
  handleMoveList,
  handleMoveTask,
}) {
  const [inputValue, setInputValue] = useState(''); // input value for "new project" text field
  const [isDropdownOpen, setIsDropDownOpen] = useState(false);
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

  // creates a new task object and adds it array of tasks
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') return;
    let newTaskObj = createTask(inputValue);
    handleAddTask(newTaskObj, projectIndex, listIndex); // calls parent function
    setInputValue('');
  };

  // create a new task object
  function createTask(taskName) {
    return {
      id: Date.now().toString(),
      name: taskName,
      complete: false,
      attributes: { priority: 'none', dueDate: null },
    };
  }

  function getTaskCompletion(list) {
    if (list.tasks.length !== 0) {
      const completeTaskCount = list.tasks.filter((task) => task.attributes.complete).length;
      const totalTaskCount = list.tasks.length;
      const percentageComplete = Math.floor((completeTaskCount / totalTaskCount) * 100);
      return (
        <div className="task-completion-div-content">
          <div className="task-completion-visual-div">
            <div className="visual-bottom-div"></div>
            <div className="visual-top-div" style={{ width: `${percentageComplete}%` }}></div>
          </div>
          <span>{`${percentageComplete}% Complete`}</span>
        </div>
      );
    } else {
      return 'No tasks created';
    }
  }

  function updateTaskAttributes(attributeType, newValue, taskIndex) {
    handleUpdateTaskAttributes(attributeType, newValue, projectIndex, listIndex, taskIndex);
  }

  function handleTaskDeleteAux(taskIndex) {
    handleTaskDelete(projectIndex, listIndex, taskIndex);
  }

  const handleRenameButton = () => {
    const uniqueEvent = 'listRename' + selectedListId;
    document.dispatchEvent(new CustomEvent(uniqueEvent));
  };

  return (
    <div className="list-div">
      <div className="list-header">
        <div className="list-title-div">
          <h3 className="list-title" style={{ display: 'inline-block' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="24"
              viewBox="0 0 29 24"
              fill="none"
              style={{ marginRight: '5px' }}
            >
              <path
                d="M6.04163 10C6.04163 8.11438 6.04163 7.17157 6.62741 6.58579C7.2132 6 8.15601 6 10.0416 6H15.2679C16.0815 6 16.4883 6 16.8544 6.15092C17.2206 6.30184 17.5092 6.58849 18.0865 7.1618L20.1004 9.1618C21.4468 10.4989 22.12 11.1675 22.12 12C22.12 12.8325 21.4468 13.5011 20.1004 14.8382L18.0865 16.8382C17.5092 17.4115 17.2206 17.6982 16.8544 17.8491C16.4883 18 16.0815 18 15.2679 18H10.0416C8.15601 18 7.2132 18 6.62741 17.4142C6.04163 16.8284 6.04163 15.8856 6.04163 14V10Z"
                fill="black"
              />
            </svg>

            {listObj.name}
          </h3>

          <div className="list-more-actions-div" style={{ display: 'inline-block' }}>
            <svg
              className="list-more-actions-svg"
              onClick={() => setIsDropDownOpen(!isDropdownOpen)}
              ref={dropDownSvgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              viewBox="0 0 24 23"
              fill="none"
              style={{ cursor: 'pointer' }}
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
              <div className="list-dropdown-menu" ref={dropDownRef}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  <li
                    key="rename"
                    onClick={() => {
                      handleRenameButton();
                      setIsDropDownOpen(!isDropdownOpen);
                    }}
                  >
                    <div style={{ cursor: 'pointer' }}>
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
                        <path d="M12.5 7.5L15.5 5.5L18.5 8.5L16.5 11.5L12.5 7.5Z" fill="#626060" />
                      </svg>
                      Rename
                    </div>
                  </li>
                  <li
                    key="delete"
                    onClick={() => {
                      handleListDelete(projectIndex, listIndex);
                      setIsDropDownOpen(!isDropdownOpen);
                    }}
                  >
                    <div className="list-delete-btn-div" style={{ cursor: 'pointer' }}>
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
                      <span style={{ color: '#D82323' }}>Delete list</span>
                    </div>
                  </li>
                  <li key="up">
                    <div
                      onClick={() => {
                        handleMoveList(1, selectedProjectId, selectedListId);
                        setIsDropDownOpen(!isDropdownOpen);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <button key="but-up" style={{ fontSize: '8px' }} className="up-down-button">
                        &#9650; {/*Unicode for up arrow*/}
                      </button>
                    </div>
                  </li>
                  <li key="down">
                    <div
                      onClick={() => {
                        handleMoveList(0, selectedProjectId, selectedListId);
                        setIsDropDownOpen(!isDropdownOpen);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <button key="but-down" style={{ fontSize: '8px' }} className="up-down-button">
                        &#9660; {/*Unicode for down arrow*/}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="rename-entry">
            <RenameList
              handleRenameList={handleRenameList}
              selectedProjectId={selectedProjectId}
              selectedListId={selectedListId}
            />
          </div>
        </div>
        <div className="task-completion-div">{getTaskCompletion(listObj)}</div>
      </div>
      <div className="list-body">
        <div className="task-attribute-label-div">
          <div id="label-task-name" className="label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="label-svg"
            >
              <rect x="5" y="4" width="14" height="17" rx="2" stroke="#7D7C78" stroke-width="2" />
              <path d="M9 9H15" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path d="M9 13H15" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path d="M9 17H13" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
            </svg>
            Task name
          </div>
          <div id="label-priority" className="label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="label-svg"
            >
              <path d="M12 5V3" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path d="M12 21V19" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path
                d="M16.9497 7.05026L18.364 5.63605"
                stroke="#7D7C78"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5.63603 18.364L7.05025 16.9497"
                stroke="#7D7C78"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path d="M19 12L21 12" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path d="M3 12L5 12" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path
                d="M16.9497 16.9497L18.364 18.364"
                stroke="#7D7C78"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M5.63603 5.63605L7.05025 7.05026"
                stroke="#7D7C78"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Priority
          </div>
          <div id="label-due" className="label">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="label-svg"
            >
              <rect x="3" y="6" width="18" height="15" rx="2" stroke="#7D7C78" stroke-width="2" />
              <path
                d="M3 10C3 8.11438 3 7.17157 3.58579 6.58579C4.17157 6 5.11438 6 7 6H17C18.8856 6 19.8284 6 20.4142 6.58579C21 7.17157 21 8.11438 21 10H3Z"
                fill="#7D7C78"
              />
              <path d="M7 3L7 6" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
              <path d="M17 3L17 6" stroke="#7D7C78" stroke-width="2" stroke-linecap="round" />
            </svg>
            Due
          </div>
          <div id="label-trash" className="label"></div>
        </div>
        <div className="tasks-div">
          {listObj.tasks.map((task, index) => (
            <Task
              key={task.id}
              name={task.name}
              id={task.id}
              attributes={task.attributes}
              taskIndex={index}
              updateTaskAttributes={updateTaskAttributes}
              handleTaskDeleteAux={handleTaskDeleteAux}
              selectedProjectId={selectedProjectId}
              selectedListId={selectedListId}
              selectedTaskId={task.id}
              handleRenameTask={handleRenameTask}
              handleMoveTask={handleMoveTask}
            />
          ))}
        </div>
      </div>
      <div action="" className="new-task-form-div" onSubmit={handleSubmit}>
        <form action="" className="list-form">
          <button
            type="submit"
            className="new-task-btn"
            aria-label="create new task"
            style={{ marginLeft: '15px' }}
          >
            +
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="new task name"
            aria-label="new task name"
            className="new-list-input"
          />
        </form>
      </div>
    </div>
  );
}
