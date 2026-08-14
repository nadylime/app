import React from 'react';

const webUrl=(query,directions)=>directions
  ?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`
  :`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const isIOS=()=>{
  const agent=navigator.userAgent||'';
  return /iPad|iPhone|iPod/.test(agent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
};

const isAndroid=()=>/Android/i.test(navigator.userAgent||'');

export default function GoogleMapsLink({query,directions=false,className='',children}){
  const browserUrl=webUrl(query,directions);
  const openMaps=event=>{
    if(isIOS()){
      event.preventDefault();
      let appOpened=false;
      const markOpened=()=>{if(document.visibilityState==='hidden')appOpened=true};
      document.addEventListener('visibilitychange',markOpened);
      const appUrl=directions
        ?`comgooglemaps://?daddr=${encodeURIComponent(query)}&directionsmode=driving`
        :`comgooglemaps://?q=${encodeURIComponent(query)}`;
      window.location.href=appUrl;
      window.setTimeout(()=>{
        document.removeEventListener('visibilitychange',markOpened);
        if(!appOpened&&document.visibilityState==='visible')window.location.href=browserUrl;
      },1200);
      return;
    }
    if(isAndroid()){
      event.preventDefault();
      const path=directions
        ?`maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`
        :`maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.location.href=`intent://www.google.com/${path}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(browserUrl)};end`;
    }
  };

  return <a className={className} href={browserUrl} onClick={openMaps}>{children}</a>;
}
