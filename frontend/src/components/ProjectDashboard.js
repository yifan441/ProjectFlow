import { useState } from 'react';
import List from './List';
import { RenameLists } from './Rename.js'

export default function ProjectDashboard({
  handleAddList,
  handleAddTask,
  handleUpdateTaskAttributes,
  projectIndex,
  projectObj,
  handleListDelete,
  handleTaskDelete,
  handleRenameList,
  selectedProjectId,
}) {
  const [inputValue, setInputValue] = useState(''); // input value for "new project" text field
  const [query, setQuery] = useState('');
  const listsArray = projectObj.lists;
  const projectName = projectObj.name;

  // updates inputValue to be user inputed value everytime a change is detected
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // creates a new list object and adds it array of lists
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue === '') return;
    let newListObj = createList(inputValue);
    handleAddList(newListObj, projectIndex); // calls parent function
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

  // filter lists based on query
  const filteredLists = listsArray.filter((list) =>
    list.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="project-display-div">
        <div className="project-display-header-div">
          <h1>{projectName}</h1>
          <div>
           {/* Static magnifying glass figure */}
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
              className="feather feather-search" // Add a class for styling if needed
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search lists"
            />
          </div>
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
          {filteredLists.length === 0 ? (
            <p>No list found</p>
          ) : (
            filteredLists.map((list, index) => (
              <List
                key={list.id}
                listObj={list}
                handleAddTask={handleAddTask}
                handleUpdateTaskAttributes={handleUpdateTaskAttributes}
                projectIndex={projectIndex}
                listIndex={
                  listsArray.indexOf(list) // need to get og index, not index after filtering
                }
                handleListDelete={handleListDelete}
                handleTaskDelete={handleTaskDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
