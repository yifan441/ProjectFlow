import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RenameTask } from './Rename'

export default function Task({
  name,
  id,
  attributes,
  taskIndex,
  updateTaskAttributes,
  handleTaskDeleteAux,
  handleRenameTask,
  selectedProjectId,
  selectedListId,
  selectedTaskId,
}) {
  const parsedDueDate = attributes.dueDate !== null ? new Date(attributes.dueDate) : null;
  const [isChecked, setIsChecked] = useState(attributes.complete);
  const [priority, setPriority] = useState(attributes.priority);
  const [dueDate, setDueDate] = useState(parsedDueDate);
  const [showTimeInput, setshowTimeInput] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    updateTaskAttributes('complete', !isChecked, taskIndex);
  };

  const handlePriorityChange = (e) => {
    if (e.target.value === priority || (e.target.value === 'clear' && priority === 'none')) return;
    if (e.target.value === 'clear') {
      setPriority('none');
      updateTaskAttributes('priority', 'none', taskIndex);
    } else {
      setPriority(e.target.value);
      updateTaskAttributes('priority', e.target.value, taskIndex);
    }
  };

  const handleDateChange = (date) => {
    if (date === dueDate) return;
    setDueDate(date);
    if (date !== null) {
      const newDate = date.toISOString();
      updateTaskAttributes('dueDate', newDate, taskIndex);
    } else {
      updateTaskAttributes('dueDate', null, taskIndex);
    }
  };

  // TODO: build a toggle to makes choosing a time optional (this doesn't work yet)
  // const CustomInput = ({ value, onClick }) => (
  //   <div>
  //     <input
  //       type="text"
  //       value={value}
  //       onClick={onClick}
  //       readOnly
  //       style={{ width: '200px' }} // Adjust the width as needed
  //     />
  //     <label>
  //       <input
  //         type="checkbox"
  //         checked={showTimeInput}
  //         onChange={() => setshowTimeInput(!showTimeInput)}
  //       />
  //       Include Time
  //     </label>
  //   </div>
  // );

  const handleRenameButton = () => {
    const uniqueEvent = 'taskRename' + selectedTaskId;
    document.dispatchEvent(new CustomEvent(uniqueEvent));
  }

  return (
    <>
      <div className="task">
        <div className="task-name-div" style={{ width: '100px', display: 'inline-block' }}>
          <input type="checkbox" id={id} checked={isChecked} onChange={handleCheckboxChange} />
          <label htmlFor={id}>
            <span className="custom-checkbox"></span>
            {name}
          </label>
          <button type="button" onClick={handleRenameButton} className="btn-rename-list" aria-label="Rename List">
            Rename
          </button>
        </div>

        {/* Dropdown menu for task priority */}
        <div className="task-priority-div" style={{ display: 'inline-block' }}>
          <select value={priority} onChange={handlePriorityChange}>
            <option value="none" disabled hidden></option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="clear">Clear</option>
          </select>
        </div>

        {/* Date picker for task due date */}
        <div className="task-date-div" style={{ display: 'inline-block' }}>
          <DatePicker
            selected={dueDate}
            onChange={handleDateChange}
            placeholderText="Select Due Date"
            dateFormat="MMMM d, yyyy h:mm aa"
            showTimeInput
            timeInputLabel="Time:"
            timeFormat="HH:mm"
            isClearable

          // TODO: build a toggle to makes choosing a time optional
          // dateFormat={showTimeInput ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy'}
          // showTimeInput={showTimeInput}
          // customInput={<CustomInput />}
          />
        </div>
        <div className="task-delete-btn-div" style={{ display: 'inline-block' }}>
          <svg
            onClick={() => {
              handleTaskDeleteAux(taskIndex);
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
        <RenameTask
          selectedProjectId={selectedProjectId}
          selectedListId={selectedListId}
          selectedTaskId={selectedTaskId}
          handleRenameTask={handleRenameTask}
        />
      </div>
    </>
  );
}
