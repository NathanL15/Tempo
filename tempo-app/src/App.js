import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Form from './components/Form';
import Login from  './components/Login'
import Playlist from './components/Playlist';
import PhysicalSelect from './components/PhysicalSelect';
import { GenreSelect } from './components';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<GenreSelect />} />
        <Route path="/stats" element={<PhysicalSelect />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </Router>
  );
}

export default App;
