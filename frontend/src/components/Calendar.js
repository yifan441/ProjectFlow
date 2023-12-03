import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

export default function Calendar({ projectsData }) {
  const transformDataToEvents = () => {
    let events = [];
    projectsData.forEach((project) => {
      project.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          if (task.attributes.dueDate) {
            let priorityColor = '';
            switch (task.attributes.priority) {
              case 'high':
                priorityColor = 'red';
                break;
              case 'medium':
                priorityColor = 'orange';
                break;
              case 'low':
                priorityColor = 'green';
                break;
              default:
                priorityColor = 'blue';
                break;
            }

            const event = {
              title: task.name,
              start: new Date(task.attributes.dueDate),
              end: new Date(task.attributes.dueDate),
              priority: task.attributes.priority,
              backgroundColor: priorityColor, // Change 'color' to 'backgroundColor'
              project: project.name,
              list: list.name,
              task: task.name,
            };
            events.push(event);
          }
        });
      });
    });
    return events;
  };

  const events = transformDataToEvents();

  const handleEventClick = (event) => {
    const { project, list, task } = event;
    alert(`Project: ${project}\nList: ${list}\nTask: ${task}`);
  };

  return (
    <div className="calendar-page-container">
      <h1>Calendar</h1>
      <div style={{ height: 500 }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.backgroundColor, // Apply backgroundColor
            },
          })}
          onSelectEvent={handleEventClick}
        />
      </div>
    </div>
  );
}
