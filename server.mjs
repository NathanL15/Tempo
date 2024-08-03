import express from "express";
import axios from "axios";
import querystring from "querystring";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();
const port = 3000;
const redirect_uri = 'http://localhost:3000/callback';
let genre_arr = ['hip-hop', 'pop', 'rock', 'country', 'alternative', 'edm'];

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

// Redirect to Spotify for authentication
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read';
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

async function getUserID(access_token) {
  try {
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    return userResponse.data.id;
  } catch (e) {
    console.error('Error getting user id: ', e);
  }
}

async function getRecommendations(bpm, genre, access_token) {
  try {
    const minBpm = Math.max(bpm - 10, 50);
    const maxBpm = Math.min(bpm + 10, 300);
    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${genre}&min_tempo=${minBpm}&max_tempo=${maxBpm}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      }
    );
    const tracks = tracksResponse.data.tracks;
    console.log('Recommended Tracks:');
    tracks.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} by ${item.artists.map(artist => artist.name).join(', ')}`);
    });
    const trackUris = tracks.map(track => track.uri);
    return trackUris;
  } catch (e) {
    console.error('Error getting recommendations: ', e);
  }
}

async function getLikedSongs(access_token) {
  try {
    const songsResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: {
        limit: 20, // Number of songs to return (default is 20, max is 50)
        offset: 0  // The index of the first song to return (use for pagination)
      }
    })
    const likedSongs = songsResponse.data.items;
    console.log('Liked Songs:');
    likedSongs.forEach((item, index) => {
      console.log(`${index + 1}. ${item.track.name} by ${item.track.artists.map(artist => artist.name).join(', ')}`);
    });
  } catch (e) {
    console.error('Error fetching liked songs:', e);
  }
}

async function createNewPlaylistAndAddSongs(user_id, playlistName, access_token, trackUris) {
  try {
    if (trackUris.length === 0) {
      return res.send('No tracks found to add to the playlist.');
    }

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
    return playlistResponse.data.external_urls.spotify
  } catch (e) {
    console.error('Error creating playlist: ', e);
  }
}

function calculateBPM(height, distance, time) {
  const strideLength = 0.43 * height;
  const numberOfStrides = distance / (strideLength / 100); // Convert stride length from cm to meters
  const timeInMinutes = time / 60;
  const bpm = numberOfStrides / timeInMinutes;
  return bpm;
}

// Create and populate the playlist
app.get('/create_playlist', async (req, res) => {
  const access_token = req.query.access_token;
  const playlistName = req.query.playlistName || 'New Playlist';
  const genre = req.query.genre || 'pop';
  const height = req.query.height || 185; // Example height in cm
  const time = req.query.time || 30*60; // Example time in seconds
  const distance = req.query.distance || 5000; // Example distance in meters

  if (!access_token) {
    return res.send('No access token provided.');
  }

  const bpm = calculateBPM(height, distance, time);
  console.log('Calculated BPM:', bpm);

  const user_id = await getUserID(access_token);

  const trackUris = await getRecommendations(bpm, genre, access_token);

  const likedSongs = await getLikedSongs(access_token);

  const playlistUrl = await createNewPlaylistAndAddSongs(user_id, playlistName, access_token, trackUris);
  res.send(`Playlist created and populated: <a href="${playlistUrl}" target="_blank">${playlistUrl}</a>`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
