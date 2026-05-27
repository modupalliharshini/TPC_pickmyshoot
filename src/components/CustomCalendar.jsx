import React, { useState, useEffect, useRef } from 'react';

export default function CustomCalendar({ selectedDate, onSelectDate, calendarId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (e, direction) => {
    e.stopPropagation();
    let nextMonth = currentMonth + direction;
    let nextYear = currentYear;

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }

    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const handleSelectDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(dateStr);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!selectedDate) return "Select Photoshoot Date";
    const [year, month, day] = selectedDate.split('-');
    const mNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${mNamesShort[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };

  const renderDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const cells = [];

    // Empty cells before start of month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isSelected = selectedDate === dateStr;
      const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
      
      const cellDate = new Date(currentYear, currentMonth, day);
      const comparisonToday = new Date(todayYear, todayMonth, todayDate);
      const isDisabled = cellDate < comparisonToday;

      cells.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={(e) => {
            if (isDisabled) return;
            e.stopPropagation();
            handleSelectDate(day);
          }}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  return (
    <div 
      className="custom-calendar-picker-wrapper" 
      ref={calendarRef} 
      style={{ position: 'relative', width: '100%' }}
    >
      <div 
        className="calendar-selector-btn" 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ cursor: 'pointer' }}
      >
        <span className="calendar-selected-value">{getDisplayValue()}</span>
        <i className="fa-regular fa-calendar-days"></i>
      </div>
      
      <div 
        className={`custom-calendar-picker ${isOpen ? 'show' : ''}`} 
        id={calendarId}
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        <div className="calendar-header">
          <button 
            type="button" 
            className="calendar-nav-btn prev-month" 
            onClick={(e) => handleMonthChange(e, -1)}
            aria-label="Previous month"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="calendar-month-year">{monthNames[currentMonth]} {currentYear}</span>
          <button 
            type="button" 
            className="calendar-nav-btn next-month" 
            onClick={(e) => handleMonthChange(e, 1)}
            aria-label="Next month"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
        </div>
        
        <div className="calendar-days">
          {renderDays()}
        </div>
      </div>
    </div>
  );
}
