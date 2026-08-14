import React from 'react';
import GoogleMapsLink from './GoogleMapsLink.jsx';

const events=[['5:00 PM','Guests arrive and are seated'],['5:20 PM','Please be in your seats'],['5:30 PM','Ceremony begins'],['6:00 PM','Cocktail hour'],['6:35 PM','Couple joins cocktail hour'],['6:55 PM','Head to reception venue'],['7:00 PM','First dance'],['7:05 PM','Father and daughter dance'],['7:10 PM','Mother and son dance'],['7:20 PM','Dinner opens'],['7:50 PM','Toasts and speeches'],['8:15 PM','Cake cutting'],['8:45 PM','Grand entrance and couple returns'],['8:55 PM','The Shoe Game'],['9:10 PM','Thank you and goodbye speech'],['9:15 PM','Group photo'],['9:20 PM','Dancing begins'],['10:15 PM','Late night snacks'],['11:45 PM','Final dance'],['12:00 AM','Event closes']];
const venue='Full Send Summit, Salida, Colorado';

export default function Wedding(){
  return <div>
    <div className="wedding-venue"><b>Full Send Summit · Salida, CO</b><br/><GoogleMapsLink query={venue} directions>Open directions in Google Maps ↗</GoogleMapsLink></div>
    {events.map((event,index)=><div className="wedding-event" key={index}><b>{event[0]}</b><span>{event[1]}</span></div>)}
    <a className="wedding-site" href="https://www.theknot.com/us/isabel-curry-and-zach-gray-sep-2026" target="_blank" rel="noreferrer">Wedding website ↗</a>
  </div>;
}
