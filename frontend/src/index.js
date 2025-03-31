import React from 'react';
import ReactDOM from 'react-dom/client';
//import './App.css';  // Si tienes este archivo, no lo elimines
import App from './App';

// Eliminamos las importaciones innecesarias
// import './index.css';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si decidiste usar reportWebVitals, puedes dejarlo o eliminarlo completamente
// reportWebVitals();
