// src/index.js  - IMPORTANT:  Wrap App with Router here!
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithRouter from './App'; // Import the wrapped App
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWithRouter /> {/* Render AppWithRouter */}
  </React.StrictMode>
);

reportWebVitals();