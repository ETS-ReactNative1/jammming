import queryString from 'query-string';

const clientID = '959b4afcdfe3414bbe2488cadf59f42b';
const clientSecret = '56d4f2b093b0442d81233f47592dbf38';
let accessToken;
const spotify_url = 'https://accounts.spotify.com/authorize'
const redirect_uri = 'http://localhost:3000/'

// Generate a random state for extra security.
const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyz';
const index1 = Math.floor(Math.random() * alphanumeric.length);
const index2 = Math.floor(Math.random() * alphanumeric.length);
const index3 = Math.floor(Math.random() * alphanumeric.length);
const state = alphanumeric[index1] + alphanumeric[index2] + alphanumeric[index3];

const accessURL = `${spotify_url}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
//const finalURL = `${redirect_uri}callback#access_token=${accessToken}&token_type=Bearer&expires_in=${expires}&state=${state}`

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      const accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
    }
    else {
      window.location = accessURL;
    }
  },


  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      }
    })
  },


  savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      const accessToken = this.getAccessToken();
      let userID = '';
      let playlistID = null;


      fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      }).then(response => { return response.json() }
      ).then(jsonResponse => {userID.replace('', jsonResponse.user_id)});


      fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }}).then(jsonResponse => {
        playlistID.push(jsonResponse.id)
      });


      fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      }).then(response => {
        if (response.ok) {
          return response.json();
        }}).then(jsonResponse => {
        playlistID.push(jsonResponse.id)
      });
    } else {
      return;
    }
  }
}


export default Spotify;
