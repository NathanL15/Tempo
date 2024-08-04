import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Welcome to BPM Playlist Creator</h2>
      <p>Please log in with your Spotify account to create a custom playlist.</p>
      <button onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
};

export default Login;