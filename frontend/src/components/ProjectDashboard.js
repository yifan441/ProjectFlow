import { useState } from 'react';
import List from './List';

export default function ProjectDashboard({
  handleProjectDelete,
  listsArray,
  projectName,
  projectId,
  handleAddList,
  handleAddTask,
}) {
  const [inputValue, setInputValue] = useState(''); // input value for "new project" text field

  // updates inputValue to be user inputed value everytime a change is detected
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // creates a new list object and adds it array of lists
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') return;
    let newListObj = createList(inputValue);
    handleAddList(newListObj, projectId); // calls parent function
    setInputValue('');
  };

  // create a new list object
  function createList(listName) {
    return {
      id: Date.now().toString(),
      name: listName,
      tasks: [],
    };
  }

  return (
    <>
      <div className="project-display-div">
        <div className="project-display-header-div">
          <h1>{projectName}</h1>
          <button onClick={handleProjectDelete}> delete project</button>
          <form action="" className="new-list-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="New list"
              aria-label="New list"
            />
            <button type="submit" className="btn-create" aria-label="create new list">
              +
            </button>
          </form>
        </div>
        <hr className="line" />
        <div className="project-display-lists-div">
          {listsArray.map((list) => (
            <List
              key={list.id}
              listObj={list}
              handleAddTask={handleAddTask}
              projectId={projectId}
              listId={list.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}
