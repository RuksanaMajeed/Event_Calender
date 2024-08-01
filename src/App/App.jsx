import React,{ useState, useEffect, useCallback } from 'react'
import { CalenderHeader } from '../Components/CalenderHeader/CalenderHeader';
import {Day} from '../Components/Day/Day'
import '../App.css'
import { NewEventModel } from '../Components/NewEventModel/NewEventModel';
import { DeleteEventModel } from '../Components/DeleteEventModel/DeleteEventModel';


export const App = () => {
    const [nav, setNav] = useState(0) ;
    const [days, setDays] = useState([]);
    const [dateDisplay,setDateDisplay] = useState();
    const [clicked, setClicked] = useState();

    const [events, setEvents] = useState(localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []);
    
    const eventFordate = useCallback((date) => {
        events.find(e =>e.date ===date);
    }, [events])

    useEffect(() => {
        localStorage.setItem('events',JSON.stringify(events));
    }, [events])

    useEffect(() => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dt = new Date();
    
        if (nav !== 0) {
          dt.setMonth(new Date().getMonth() + nav);
        }
    
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
    
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
    
        setDateDisplay(`${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`);
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    
        const daysArr = [];
    
        for (let i = 1; i <= paddingDays + daysInMonth; i++) {
          const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    
          if (i > paddingDays) {
            daysArr.push({
              value: i - paddingDays,
              event: eventFordate(dayString),
              isCurrentDay: i - paddingDays === day && nav === 0,
              date: dayString,
            });
          } else {
            daysArr.push({
              value: 'padding',
              event: null,
              isCurrentDay: false,
              date: '',
            });
          }
        }
    
        setDays(daysArr);
      }, [events, nav, eventFordate]);
    
      
    //works when both events and nav changes
    return (
        <>
        <div id="container">
            <CalenderHeader
            dateDisplay={dateDisplay}
            onNext={()=>setNav(nav+1)}
            onBack={()=>setNav(nav-1)}
            />
            
            <div id="weekdays"> 
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                 
            </div>
            <div id="calendar">
                {days.map((d,index)=> (
                    <Day
                    key={index} 
                    day={d}
                    onClick={()=>{
                        if(d.value !== 'padding'){
                            setClicked(d.date);
                        }

                    }}
                    />
                ))}
                
            </div>
        </div>
        {
        clicked && !eventFordate(clicked) &&
        <NewEventModel
          onClose={() => setClicked(null)}
          onSave={title => {
            setEvents([ ...events, { title, date: clicked }]);
            setClicked(null);
          }}
        />
      }

      {
        clicked && eventFordate(clicked) &&
        <DeleteEventModel 
          eventText={eventFordate(clicked).title}
          onClose={() => setClicked(null)}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked));
            setClicked(null);
          }}
        />
      }
    </>
    );
}; 
