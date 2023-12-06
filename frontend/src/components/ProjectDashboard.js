import { useState } from 'react';
import List from './List';

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
  handleRenameTask,
  handleMoveList,
  handleMoveTask,
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
    <div className="project-display-div">
      <div className="color-block"></div>
      <div className="project-display-header-div">
        <div className="project-title-and-search">
          <h1 style={{ display: 'inline-block' }}>{projectName}</h1>
          <div className="outer-search-div" style={{ display: 'inline-block' }}>
            <div className="search-bar-div">
              {/* Static magnifying glass figure */}
              <input
                className="search-bar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => setQuery('')}
                type="search"
                placeholder="Search lists"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="24"
                viewBox="0 0 23 24"
                fill="none"
                className="search-icon"
              >
                <ellipse cx="10.6675" cy="11" rx="6.4733" ry="7" stroke="#7D7C78" strokeWidth="2" />
                <path
                  d="M18.9903 20L16.216 17"
                  stroke="#7D7C78"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <form action="" className="new-list-form" onSubmit={handleSubmit}>
          <button type="submit" className="add-list-btn" aria-label="create new list">
            +
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="New list"
            aria-label="New list"
          />
        </form>
      </div>
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
              handleRenameList={handleRenameList}
              selectedProjectId={selectedProjectId}
              selectedListId={list.id}
              handleRenameTask={handleRenameTask}
              handleMoveList={handleMoveList}
              handleMoveTask={handleMoveTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
