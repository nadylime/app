import React from 'react';
import ReactDOM from 'react-dom/client';

function App(){
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <img src="/logo.svg" alt="Togetherly" className="w-20 mb-4"/>
      <h1 className="text-3xl font-bold">Togetherly</h1>
      <p className="mt-2 text-center max-w-sm">A warm space for couples to check in, reflect, and grow together.</p>
      <button className="mt-6 px-6 py-3 bg-white text-brandPeach rounded-full font-semibold shadow-lg">Start Check-In</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
