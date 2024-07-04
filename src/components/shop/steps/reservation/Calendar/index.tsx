'use client'
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import '../Calendar/style.css';

const Home: React.FC = () => {
  const [dateSelected, setDateSelected] = useState<string>();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleDateClick = (info: any) => {
    setDateSelected(info.dateStr);

    setSelectedDates(prevDates => {
      if (prevDates.includes(info.dateStr)) {
        info.dayEl.style.backgroundColor = '#fff';
        return prevDates.filter(date => date !== info.dateStr);
      } else {
        info.dayEl.style.backgroundColor = '#00E02E';
        return [...prevDates, info.dateStr];
      }
    });
    
  };

  
  return (
    <div>
      <FullCalendar
        selectable={true}
        plugins={[interactionPlugin, dayGridPlugin]}
        locale={frLocale}
        themeSystem={'standard'}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
        initialView="dayGridMonth"
        height={'auto'}
        dateClick={handleDateClick}
        
      />

      <div>
        <h3>Dates sélectionnées :</h3>
        <ul>
          {selectedDates.map(date => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
