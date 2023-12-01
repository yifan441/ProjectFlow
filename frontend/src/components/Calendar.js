import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar() {
  return (
    <div className="calendar-page-container">
      <h1>Calendar</h1>
      <div style={{ height: 500 }}>
        <BigCalendar
          localizer={localizer}
          events={[]} // Pass an empty array to display an empty calendar
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          // Other props as needed
        />
      </div>
    </div>
  );
}
