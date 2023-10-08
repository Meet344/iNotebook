import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NoteState from './Context/notes/NoteState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NoteState>
    <App />
    </NoteState>
  </React.StrictMode>
);

