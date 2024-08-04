import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GenreSelect.css';

const GenreSelect = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (selectedGenre) {
      navigate(`/stats?access_token=${accessToken}&genre=${selectedGenre}`);
    } else {
      alert('Please select a genre.');
    }
  };

  return (
    <div class="container">
        <div id="header">
            <div id="brand-text">
                <p><b>TEMPO</b></p>
            </div>
        </div>
        
        <div id="main-background">
            <div id="main-text">
            <p id="large-text">Time to select a genre for your run!</p>
            <p id="small-text">(Or choose to use your liked songs)</p>
            </div>

            <div id="selection-background">
                <form onSubmit={handleSubmit}>
                    <div class="radiobtn">
                      <input type="radio" id="liked-songs"
                            name="liked-songs" value="liked-songs" onChange={handleGenreSelect}/>
                      <label for="liked-songs">LIKED SONGS</label>
                    </div>
                    <div class="radiobtn">
                      <input type="radio" id="pop"
                            name="pop" value="pop" onChange={handleGenreSelect}/>
                      <label for="pop">POP</label>
                    </div>
                    <div class="radiobtn">
                        <input type="radio" id="hip-hop"
                            name="hip-hop" value="hip-hop" onChange={handleGenreSelect}/>
                        <label for="hip-hop">HIP-HOP</label>
                    </div>
                    <div class="radiobtn">
                        <input type="radio" id="classical"
                            name="classical" value="classical" onChange={handleGenreSelect}/>
                        <label for="classical">CLASSICAL</label>
                    </div>
                    <div class="radiobtn">
                        <input type="radio" id="rock"
                            name="rock" value="rock" onChange={handleGenreSelect}/>
                        <label for="rock">ROCK</label>
                    </div>
                    <div class="radiobtn">
                        <input type="radio" id="edm"
                            name="edm" value="edm" onChange={handleGenreSelect}/>
                        <label for="edm">EDM</label>
                    </div>
                    <input type="submit" value="SUBMIT" />
                  </form>
                
            </div>
        </div>
        
    </div>
  );
}

export default GenreSelect;