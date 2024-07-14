import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { useDateContext } from '../../../../../../dateContext';
import '../Calendar/style.css'
import { border } from '@cloudinary/url-gen/qualifiers/background';

const Home: React.FC = () => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } = useDateContext();
  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null); 
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      updateCalendarDates();
    }
  }, [selectedWeekDays, selectedSaturdays]);

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const events = [
        ...selectedWeekDays.map(date => ({ title: '12', start: date, backgroundColor: '#00E02E', border:'2px solid #00E02E' })),
        ...selectedSaturdays.map(date => ({ title: '12', start: date, backgroundColor: '#00E02E' }))
      ];

      calendarApi.addEventSource(events);
      calendarApi.render();
    }
  };

  const handlePrevNextClick = (arg: any) => {
    const { view } = arg;
    const newDate = view.activeStart;
    const formattedNewDate = newDate.toISOString().split('T')[0];
    console.log('Changing month to: ', formattedNewDate);
    if (arg.type === 'prev') {
      calendarApiRef.current.prev();
    } else if (arg.type === 'next') {
      calendarApiRef.current.next();
    }
    updateCalendarDates();
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    const dayOfWeek = clickedDate.getDay();
    const isSaturday = dayOfWeek === 6;
    const dateString = info.dateStr;

    if ((dayOfWeek >= 1 && dayOfWeek <= 5) || isSaturday) {
      if (selectedDates.includes(dateString)) {
        removeDate(dateString, isSaturday);
        setSelectedDates(selectedDates.filter(date => date !== dateString));
        (dateEl as HTMLElement).style.backgroundColor = '#00E02E';
      } else {
        addDate(dateString, isSaturday);
        setSelectedDates([...selectedDates, dateString]);
        (dateEl as HTMLElement).style.backgroundColor = '#fff';
      }
    }
  };

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
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
        datesSet={handlePrevNextClick} 
      />
    </div>
  );
};

export default Home;
