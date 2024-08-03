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
  console.log('Authorization code:', code); // Log the authorization code

  if (!code) {
    res.status(400).send('No code provided');
    return;
  }

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
    console.log('Access token:', access_token); // Log the access token

    // Redirect to create_playlist route with the access token
    res.redirect(`/create_playlist?access_token=${access_token}`);
  } catch (error) {
    console.error('Error during authentication', error.response ? error.response.data : error.message);
    res.send('Error during authentication');
  }
});

app.get('/create_playlist', async (req, res) => {
  const access_token = req.query.access_token;
  console.log('Access token in create_playlist:', access_token); // Log the access token

  try {
    // Get user ID
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const user_id = userResponse.data.id;
    console.log('User ID:', user_id); // Log the user ID

    // Create a new playlist
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        name: 'Generated Playlist',
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
    console.log('Playlist ID:', playlist_id); // Log the playlist ID

    // Search for tracks with specified BPM
    const bpm = parseInt(req.query.bpm) || 120;
    const minBpm = Math.max(bpm - 10, 50);
    const maxBpm = Math.min(bpm + 10, 300);

    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=pop&min_tempo=${minBpm}&max_tempo=${maxBpm}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    const trackUris = tracksResponse.data.tracks.map(track => track.uri);
    console.log('Track URIs:', trackUris); // Log the track URIs

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
    console.error('Error creating playlist', error.response ? error.response.data : error.message);
    res.status(500).send('Error creating playlist');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
