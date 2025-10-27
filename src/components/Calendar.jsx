import React, { useState } from 'react';
import "../index.css";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 20)); // May 2025, 20th selected
  const [selectedDate, setSelectedDate] = useState(20);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInPrevMonth = getDaysInMonth(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  );

  const generateCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isNextMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isNextMonth: false
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isNextMonth: true
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];


    const eventsByDay = {
    15: [
      {
        id: 1,
        title: 'Morning Yoga',
        location: 'Seattle, WA',
        time: '8:00 AM',
        image: '/yoga.jpg',
        isPast: true
      },
      {
        id: 2,
        title: 'Team Meeting',
        location: 'Bellevue, WA',
        time: '2:00 PM',
        image: '/meeting.jpg',
        isPast: true
      }
    ],
    20: [
      {
        id: 1,
        title: 'Pickleball',
        location: 'Seattle, WA',
        time: '5:30 PM',
        image: '/pickleball.jpg',
        isPast: false
      },
      {
        id: 2,
        title: 'Reading',
        location: 'Bellevue, WA',
        time: '7:30 PM',
        image: '/reading.jpg',
        isPast: false
      },
      {
        id: 3,
        title: 'Reading',
        location: 'Bellevue, WA',
        time: '2:30 PM',
        image: '/reading.jpg',
        isPast: true
      },
      {
        id: 4,
        title: 'Reading',
        location: 'Bellevue, WA',
        time: '4:30 PM',
        image: '/reading.jpg',
        isPast: true
      }
    ],
    22: [
      {
        id: 1,
        title: 'Coffee Chat',
        location: 'Redmond, WA',
        time: '10:00 AM',
        image: '/coffee.jpg',
        isPast: false
      },
      {
        id: 2,
        title: 'Dinner Party',
        location: 'Seattle, WA',
        time: '6:30 PM',
        image: '/dinner.jpg',
        isPast: false
      }
    ],
    25: [
      {
        id: 1,
        title: 'Hiking Trip',
        location: 'North Bend, WA',
        time: '9:00 AM',
        image: '/hiking.jpg',
        isPast: false
      }
    ]
  };

  // Get events for the selected date
  const currentEvents = eventsByDay[selectedDate] || [];

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-card">
        {/* Header */}
        <div className="calendar-header">
          <h1>Calendar</h1>
          <svg 
            className="calendar-icon" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        {/* Month Navigation */}
        <div className="calendar-navigation">
          <button 
            onClick={previousMonth}
            className="nav-btn"
            aria-label="Previous month"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="calendar-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={nextMonth}
            className="nav-btn"
            aria-label="Next month"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Week day headers */}
          {weekDays.map((day, index) => (
            <div 
              key={`weekday-${index}`}
              className="weekday-header"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((dayObj, index) => (
            <button
              key={`day-${index}`}
              onClick={() => dayObj.isCurrentMonth && setSelectedDate(dayObj.day)}
              disabled={!dayObj.isCurrentMonth}
              className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${dayObj.isCurrentMonth && dayObj.day === selectedDate ? 'selected' : ''}`}
            >
              {dayObj.day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}