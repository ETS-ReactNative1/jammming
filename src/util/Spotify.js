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
      return accessToken;
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
        return jsonResponse.tracks.items.map(track => ({
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
    if (!playlistName || !trackURIs.length) {
      return;
    } else {
      const accessToken = this.getAccessToken();
      let userID = '';
      let playlistID;


      return fetch(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => response.json()
    ).then(jsonResponse => { userID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => response.json()
      ).then(jsonResponse => { playlistID = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      }).then(response => response.json()
      ).then(jsonResponse => { playlistID = jsonResponse.id;
      });});});
      console.log(userID);


    }
  }
}


export default Spotify;
