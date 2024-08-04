import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
  const [genre, setGenre] = useState('pop');
  const [height, setHeight] = useState(185);
  const [time, setTime] = useState(30 * 60);
  const [distance, setDistance] = useState(5000);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('/create_playlist', {
        params: {
          access_token: accessToken,
          genre,
          height,
          time,
          distance
        }
      });

      navigate('/playlist', { state: { playlistUrls: response.data } });
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  return (
    <div>
      <h2>Create Your BPM-Based Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Genre: </label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          <label>Height (cm): </label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </div>
        <div>
          <label>Time (seconds): </label>
          <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} />
        </div>
        <div>
          <label>Distance (meters): </label>
          <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
        </div>
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
};

export default Form;