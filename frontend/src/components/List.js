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
      return `${percentageComplete}% Complete`;
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginRight: '5px' }}
            >
              <path
                d="M14.6358 3.90949C15.2888 3.47412 15.6153 3.25643 15.9711 3.29166C16.3269 3.32689 16.6044 3.60439 17.1594 4.15938L19.8406 6.84062C20.3956 7.39561 20.6731 7.67311 20.7083 8.02888C20.7436 8.38465 20.5259 8.71118 20.0905 9.36424L18.4419 11.8372C17.88 12.68 17.5991 13.1013 17.3749 13.5511C17.2086 13.8845 17.0659 14.2292 16.9476 14.5825C16.7882 15.0591 16.6889 15.5557 16.4902 16.5489L16.2992 17.5038C16.2986 17.5072 16.2982 17.5089 16.298 17.5101C16.1556 18.213 15.3414 18.5419 14.7508 18.1351C14.7497 18.1344 14.7483 18.1334 14.7455 18.1315V18.1315C14.7322 18.1223 14.7255 18.1177 14.7189 18.1131C11.2692 15.7225 8.27754 12.7308 5.88691 9.28108C5.88233 9.27448 5.87772 9.26782 5.86851 9.25451V9.25451C5.86655 9.25169 5.86558 9.25028 5.86486 9.24924C5.45815 8.65858 5.78704 7.84444 6.4899 7.70202C6.49113 7.70177 6.49282 7.70144 6.49618 7.70076L7.45114 7.50977C8.44433 7.31113 8.94092 7.21182 9.4175 7.05236C9.77083 6.93415 10.1155 6.79139 10.4489 6.62514C10.8987 6.40089 11.32 6.11998 12.1628 5.55815L14.6358 3.90949Z"
                fill="black"
                stroke="black"
                stroke-width="2"
              />
              <path d="M5 19L9.5 14.5" stroke="black" stroke-width="2" stroke-linecap="round" />
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
                    Rename
                  </li>
                  <li key="up">
                    <button
                      key="but-up"
                      style={{ fontSize: '8px' }}
                      onClick={() => {
                        handleMoveList(1, selectedProjectId, selectedListId);
                        setIsDropDownOpen(!isDropdownOpen);
                      }}
                    >
                      &#9650; {/*Unicode for up arrow*/}
                    </button>
                  </li>
                  <li key="down">
                    <button
                      key="but-down"
                      style={{ fontSize: '8px' }}
                      onClick={() => {
                        handleMoveList(0, selectedProjectId, selectedListId);
                        setIsDropDownOpen(!isDropdownOpen);
                      }}
                    >
                      &#9660; {/*Unicode for down arrow*/}
                    </button>
                  </li>
                  <li
                    key="delete"
                    onClick={() => {
                      handleListDelete(projectIndex, listIndex);
                      setIsDropDownOpen(!isDropdownOpen);
                    }}
                  >
                    <div className="list-delete-btn-div">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-trash"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      <span>Delete list</span>
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
        <span className="task-count" style={{ marginLeft: '30px' }}>
          {getTaskCompletion(listObj)}
        </span>
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
