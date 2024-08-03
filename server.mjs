import express from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from 'dotenv';

dotenv.config({ path: './account.env' });

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/callback'
      }), {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const access_token = response.data.access_token;
    res.redirect(`/create_playlist?access_token=${access_token}`);
  } catch (error) {
    console.error('Error during authentication', error);
    res.send('Error during authentication');
  }
});

app.get('/create_playlist', async (req, res) => {
  const access_token = req.query.access_token;

  try {
    // Get user ID
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const user_id = userResponse.data.id;

    // Create a new playlist
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        name: 'New Playlist',
        public: false
      },
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const playlist_id = playlistResponse.data.id;

    // Search for tracks with 120 ± 10 BPM
    const minBpm = 110;
    const maxBpm = 130;
    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=pop&min_tempo=${minBpm}&max_tempo=${maxBpm}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    const trackUris = tracksResponse.data.tracks.map(track => track.uri);

    // Add tracks to the playlist
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        uris: trackUris
      },
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const playlistUrl = playlistResponse.data.external_urls.spotify;
    res.send(`Playlist created and populated: <a href="${playlistUrl}" target="_blank">${playlistUrl}</a>`);
  } catch (error) {
    console.error('Error creating playlist', error);
    res.status(500).send('Error creating playlist');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
