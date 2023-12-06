import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar({ projectsData }) {
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const transformDataToEvents = () => {
      let events = [];
      projectsData.forEach((project) => {
        project.lists.forEach((list) => {
          list.tasks.forEach((task) => {
            if (task.attributes.dueDate) {
              const event = {
                id: task.id,
                title: task.name,
                start: new Date(task.attributes.dueDate),
                end: new Date(task.attributes.dueDate),
                project: project.name,
                list: list.name,
                task: task,
                priority: task.attributes.priority,
              };
              events.push(event);
            }
          });
        });
      });
      return events;
    };

    const events = transformDataToEvents();

    let filtered = [...events];
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.list.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(
        (event) => event.priority === selectedPriority
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedPriority, projectsData]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let priorityColor = '';
    switch (event.priority) {
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

    const style = {
      backgroundColor: priorityColor,
    };
    return {
      style: style,
    };
  };

  const handleEventClick = (event) => {
    console.log('Clicked event:', event);
  };

  const handlePriorityChange = (selectedPriority) => {
    setSelectedPriority(selectedPriority);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="calendar-page-container">
      <h1>Calendar</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Filter by Priority:{' '}
          <select
            value={selectedPriority}
            onChange={(e) => handlePriorityChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Search Tasks:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </label>
      </div>
      <div style={{ height: 500 }}>
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          toolbar={[]}
        />
      </div>
    </div>
  );
}

