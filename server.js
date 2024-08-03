require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

async function getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token', error);
        throw error;
    }
}

app.get('/playlists', async (req, res) => {
    const tempo = req.query.tempo;
    try {
        const token = await getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/recommendations?limit=10&seed_genres=pop&target_tempo=${tempo}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching playlists', error);
        res.status(500).send('Error fetching playlists');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
