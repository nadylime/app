import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

if('serviceWorker' in navigator){
  const hadController=Boolean(navigator.serviceWorker.controller);
  let reloading=false;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'})
      .then(registration=>registration.update())
      .catch(()=>{});
  });
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(hadController&&!reloading&&!window.__APP_RELOADING__){
      reloading=true;
      window.__APP_RELOADING__=true;
      window.location.reload();
    }
  });
}
