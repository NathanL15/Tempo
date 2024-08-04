
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PhysicalSelect.css'

const PhysicalSelect = () => {
    const [distance, setDistance] = useState('');
    const [time, setTime] = useState('');
    const [height, setHeight] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const access_token = new URLSearchParams(window.location.search).get('access_token');
        const genre = new URLSearchParams(window.location.search).get('genre');
        
        try {
            const response = await axios.get('http://localhost:3001/create_playlist', {
                params: {
                    genre: genre,
                    distance: distance,
                    time: time * 60, // convert minutes to seconds
                    height: height,
                    access_token: access_token
                }
            });
            console.log({distance, time, height,access_token});
            console.log(response.data);

            // After successful submission, navigate to the next page with the playlist link
            navigate('/playlist', { state: { playlistResponse: response.data } });
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };
    return (
        <div className="container">
      <div id="header">
        <div id="brand-text">
          <p><b>TEMPO</b></p>
        </div>
      </div>
      
      <div id="main-background">
        <div id="main-text">
          <p id="large-text">Now, some more info about you.</p>
        </div>

        <div id="selection-background">
          <form onSubmit={handleSubmit}>
            <label htmlFor="distance">How far is your run? (m)</label><br />
            <input 
              type="text" 
              id="distance" 
              name="distance" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)} 
            /><br /><br />
            <label htmlFor="time">How quickly will you complete it? (mins)</label><br />
            <input 
              type="text" 
              id="time" 
              name="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
            /><br /><br />
            <label htmlFor="height">How tall are you? (cm)</label><br />
            <input 
              type="text" 
              id="height" 
              name="height" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
            /><br /><br />
            <input type="submit" value="SUBMIT" />
          </form> 
        </div>
      </div>
    </div>

    )
}

export default PhysicalSelect
