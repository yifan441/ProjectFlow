import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Task({ name, complete, id }) {

  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleDateChange = (date) => {
    setDueDate(date);
  };


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
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>


        {/* Date picker for task due date */}
        <DatePicker
            selected={dueDate}
            onChange={handleDateChange}
            placeholderText="Select Due Date"
        />
      </div>
    </>
  );
}
