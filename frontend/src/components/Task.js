import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Task({ name, complete, id, attributes }) {
  const [priority, setPriority] = useState(attributes.priority);
  const [dueDate, setDueDate] = useState(attributes.dueDate);
  const [showTimeInput, setshowTimeInput] = useState(false);

  const handlePriorityChange = (e) => {
    if (e.target.value === 'clear') {
      setPriority('none');
    } else {
      setPriority(e.target.value);
    }
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  // TODO: have a toggle to makes choosing a time optional (this doesn't work yet)
  const CustomInput = ({ value, onClick }) => (
    <div>
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        style={{ width: '200px' }} // Adjust the width as needed
      />
      <label>
        <input
          type="checkbox"
          checked={showTimeInput}
          onChange={() => setshowTimeInput(!showTimeInput)}
        />
        Include Time
      </label>
    </div>
  );

  return (
    <>
      <div className="task">
        <input type="checkbox" id={id} />
        <label htmlFor={id}>
          <span className="custom-checkbox"></span>
          {name}
        </label>

        {/* Dropdown menu for task priority */}
        <select value={priority} onChange={handlePriorityChange}>
          <option value="none" disabled hidden></option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="clear">Clear</option>
        </select>

        {/* Date picker for task due date */}
        <DatePicker
          selected={dueDate}
          onChange={handleDateChange}
          placeholderText="Select Due Date"
          dateFormat="MMMM d, yyyy h:mm aa"
          showTimeInput
          timeInputLabel="Time:"
          timeFormat="HH:mm"
          isClearable

          // TODO: have a toggle to makes choosing a time optional
          // dateFormat={showTimeInput ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy'}
          // showTimeInput={showTimeInput}
          // customInput={<CustomInput />}
        />
      </div>
    </>
  );
}
