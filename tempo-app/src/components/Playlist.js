import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Playlist = () => {
    const location = useLocation();
    const { playlistResponse } = location.state || {};

    return (
        <div className="container">
            <h1>Playlist Page</h1>
            <h2>Your Playlist</h2>
            {playlistResponse ? (
                <div>
                    <p><b>Playlist URL:</b> <a href={playlistResponse} target="_blank" rel="noopener noreferrer">{playlistResponse}</a></p>
                </div>
            ) : (
                <p>No playlist data available.</p>
            )}
        </div>
    );
};

export default Playlist;