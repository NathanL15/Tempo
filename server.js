const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET'
});

// Get an access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.get('/playlists', async (req, res) => {
  const bpm = parseInt(req.query.bpm);
  if (isNaN(bpm)) {
    return res.status(400).send('Invalid BPM');
  }

  try {
    const data = await spotifyApi.searchPlaylists('workout', { limit: 10 });
    const playlists = data.body.playlists.items;

    let filteredPlaylists = [];

    for (let playlist of playlists) {
      const tracksData = await spotifyApi.getPlaylistTracks(playlist.id);
      const tracks = tracksData.body.items;

      const trackIds = tracks.map(track => track.track.id);
      const audioFeaturesData = await spotifyApi.getAudioFeaturesForTracks(trackIds);
      const audioFeatures = audioFeaturesData.body.audio_features;

      const matchingTracks = audioFeatures.filter(track => track.tempo >= bpm - 5 && track.tempo <= bpm + 5);
      if (matchingTracks.length > 0) {
        filteredPlaylists.push(playlist);
      }
    }

    res.json(filteredPlaylists);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching playlists');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
