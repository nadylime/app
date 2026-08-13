import React from 'react';
const map=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export default function StayDetails({type,close}){
 const hotel=type==='hotel';
 const hotelAddress='4343 Airport Way, Denver, CO 80239';
 const airbnbAddress='306 Shepherd Road, Unit A, Salida, CO 81201';
 return <div className="modal-backdrop" onClick={close}><div className="modal-card" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}>×</button>{hotel?<>
  <div className="overline">DENVER · THURSDAY NIGHT</div><h2>Courtyard by Marriott Denver Airport at Gateway Park</h2>
  <p><a className="address-link" href={map(hotelAddress)} target="_blank" rel="noreferrer">{hotelAddress} ↗</a></p>
  <p><b>Stay:</b> Thursday, Sep 3 → Friday, Sep 4</p><p>First-night hotel after the group arrives in Denver.</p>
  <a className="map-link" href={map(hotelAddress)} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
 </>:<>
  <div className="overline">SALIDA · FRIDAY + SATURDAY</div><h2>Home in Salida</h2>
  <p><a className="address-link" href={map(airbnbAddress)} target="_blank" rel="noreferrer">{airbnbAddress} ↗</a></p>
  <p><b>Check-in:</b> Friday, Sep 4 at 3:00 PM<br/><b>Checkout:</b> Sunday, Sep 6 at 11:00 AM<br/><b>Guests:</b> 6 maximum<br/><b>Entry:</b> Self check-in with keypad<br/><b>House rule:</b> No pets<br/><b>Property:</b> Hot tub + mountain views · all ensuite bedrooms</p>
  <p><b>Directions from the host:</b> From Hwy 50, turn north on Holman Avenue. Continue onto Airport Rd, turn left onto Shepherd Rd (Angelview Townhomes), and it is the third unit on the left.</p>
  <a className="map-link" href={map(airbnbAddress)} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
 </>}</div></div>;
}
