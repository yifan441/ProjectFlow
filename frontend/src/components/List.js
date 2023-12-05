import { useState } from 'react';
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
  }

  return (
    <>
      <div className="list-div">
        <div className="list-header">
          <div className="list-title-div">
            <h3 className="list-title" style={{ display: 'inline-block' }}>
              {listObj.name}
            </h3>
            <div className="list-reorder" style={{ display: 'inline-block' }}>
              <button
                key="up"
                style={{ fontSize: '8px' }}
                onClick={() => {
                  handleMoveList(1, selectedProjectId, selectedListId);
                }}>
                &#9650; {/*Unicode for up arrow*/}
              </button>
              <button style={{ fontSize: '8px' }}
                onClick={() => {
                  handleMoveList(0, selectedProjectId, selectedListId);
                }}>
                &#9660; {/*Unicode for down arrow*/}
              </button>
            </div>
            <div className="rename-button" style={{ display: 'inline-block' }}>
              <button type="button" onClick={handleRenameButton} className="btn-rename-list" aria-label="Rename List">
                Rename
              </button>
            </div>
            <div className="list-delete-btn-div" style={{ display: 'inline-block' }}>
              <svg
                onClick={() => {
                  handleListDelete(projectIndex, listIndex);
                }}
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
            </div>
            <div className="rename-entry">
              <RenameList
                handleRenameList={handleRenameList}
                selectedProjectId={selectedProjectId}
                selectedListId={selectedListId} />
            </div>
          </div>
          <span className="task-count">{getTaskCompletion(listObj)}</span>
        </div>
        <div className="list-body">
          {listObj.tasks.length > 0 && (
            <div className="task-attribute-label-div">
              <p>Task name&nbsp;&nbsp;Priority&nbsp;&nbsp;Duedate</p>
            </div>
          )}
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
        <div action="" className="new-task-form" onSubmit={handleSubmit}>
          <form action="">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="new task name"
              aria-label="new task name"
            />
            <button type="submit" className="btn-create" aria-label="create new task">
              +
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
