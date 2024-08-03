const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Function to get a new access token
async function getAccessToken() {
  const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data.access_token;
}

app.post('/playlists', async (req, res) => {
  const bpm = parseInt(req.body.bpm);
  if (isNaN(bpm)) {
    return res.status(400).send('Invalid BPM');
  }

  try {
    // Get a new access token
    const accessToken = await getAccessToken();
    spotifyApi.setAccessToken(accessToken);

    const data = await spotifyApi.searchPlaylists('workout', { limit: 10 });
    const playlists = data.body.playlists.items;

    let filteredPlaylists = [];

    for (let playlist of playlists) {
      try {
        const tracksData = await spotifyApi.getPlaylistTracks(playlist.id);
        const tracks = tracksData.body.items;

        const trackIds = tracks.map(track => track.track.id);
        const audioFeaturesData = await spotifyApi.getAudioFeaturesForTracks(trackIds);
        const audioFeatures = audioFeaturesData.body.audio_features;

        const matchingTracks = audioFeatures.filter(track => track.tempo >= bpm - 5 && track.tempo <= bpm + 5);
        if (matchingTracks.length > 0) {
          filteredPlaylists.push(playlist);
        }
      } catch (trackError) {
        console.error(`Error fetching tracks or audio features for playlist ${playlist.id}`, trackError);
      }
    }

    res.json(filteredPlaylists);
  } catch (error) {
    console.error('Error fetching playlists', error);
    res.status(500).send('Error fetching playlists');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
