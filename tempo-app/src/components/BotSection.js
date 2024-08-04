import React from 'react'
import './BotSection.css'
import image from './images/music.jpg'

const BotSection = () => {
    return (
        <div id="bot-container">
            <div id="bot-text-container">
                <div id="bot-title-container">
                    <h1 id="bot-title">OUR SOLUTION.</h1>
                </div>

                <div id="bot-subtext-container">
                    <p id="bot-subtext">You provide us with your dream run, and we curate a playlist to match your pace.</p>
                </div>
            </div>

            <div id="bot-image-container">
                <img id="bot-image" src={image} alt="headphones" />
            </div>
        </div>
    );
}

export default BotSection