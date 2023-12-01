import { useState } from 'react';
import Task from './Task';

export default function List({
  listObj,
  handleAddTask,
  projectIndex,
  listIndex,
  handleUpdateTaskAttributes,
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

  return (
    <>
      <div className="list-div">
        <div className="list-header">
          <h3 className="list-title">{listObj.name}</h3>
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
