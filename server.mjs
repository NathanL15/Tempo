import express from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from 'dotenv';

dotenv.config({ path: './account.env' });

const app = express();
const port = 3000;
const redirect_uri = 'http://localhost:3000/callback'

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

// Redirect to Spotify for authentication
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`);
});

// Handle Spotify callback
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.send('No code provided.');
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
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

// Create and populate the playlist
app.get('/create_playlist', async (req, res) => {
  const access_token = req.query.access_token;
  const playlistName = req.query.playlistName || 'New Playlist';
  const bpm = parseInt(req.query.bpm) || 120;
  let genre_arr = ['hip-hop', 'pop', 'rock', 'country','alternative','edm']
  


  if (!access_token) {
    return res.send('No access token provided.');
  }

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
        name: playlistName,
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

    // Search for tracks with BPM around the specified value
    const minBpm = Math.max(bpm - 10, 50);
    const maxBpm = Math.min(bpm + 10, 300);
    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=edm&min_tempo=${minBpm}&max_tempo=${maxBpm}`,
      {
        
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );

    console.log('Tracks Response:', tracksResponse.data); // Log the response

    const trackUris = tracksResponse.data.tracks.map(track => track.uri);

    console.log('Track URIs:', trackUris); // Log the URIs

    if (trackUris.length === 0) {
      return res.send('No tracks found to add to the playlist.');
    }

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
    console.error('Error creating playlist:', error.response?.data || error.message || error);
    res.status(500).send('Error creating playlist');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
