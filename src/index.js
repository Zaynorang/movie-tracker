import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './styles/style.css'; // Impor file CSS global Anda

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BrowserRouter membungkus App Anda untuk mengaktifkan 
      fungsionalitas routing (navigasi antar halaman).
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);