import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

async function getAccessToken() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64');

  try {
    console.log("Flow 1");
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}', {
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log("Flow 2");

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token', error);
    throw error;
  }
  

}

app.get('/', async (req, res) => {
  res.send('Welcome to my server!');
  real_access_token = await getAccessToken()
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});