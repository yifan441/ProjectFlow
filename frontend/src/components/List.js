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
