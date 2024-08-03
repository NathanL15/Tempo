import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/Form';
import Playlist from './components/Playlist';

function App() {
  useEffect(() => {
    // Assuming the access token is obtained and stored somewhere
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      localStorage.setItem('accessToken', token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/form" element={<Form />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </Router> 
  );
}

export default App;