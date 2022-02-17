let accessToken = '';
const clientID = 'a6a3a92a8b994e519898c1a70a3e1adc';
const redirectURI = 'http://flo-hal-first-react-app.surge.sh/';//'http://localhost:3000/';

export const Spotify = {
    getAccessToken() { //Get a Spotify user’s access token
        if (accessToken) { //Check if the user’s access token is already set. If it is, return the value saved to access token.
            return accessToken; 
        } else if ( window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/) ) { //If the access token is not already set, check the URL to see if it has just been obtained.
            const accessMatch = window.location.href.match(/access_token=([^&]*)/);
            accessToken = accessMatch[1]; //Set the access token value
            const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
            const expiresIn = expiresMatch[1]; //Set a variable for expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000); //Set the access token to expire at the value for expiration time
            window.history.pushState('Access Token', null, '/'); //Clear the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired
        } else { //redirect users to obtain accessToken
            let url = 'https://accounts.spotify.com/authorize?';
            url += 'client_id=' + clientID;
            url += '&response_type=token';
            url += '&scope=playlist-modify-public'
            url += '&redirect_uri=' + redirectURI;
            window.location = url;
        }
    },

    async search(term) { //Send a search request to the Spotify API
            const url = 'https://api.spotify.com/v1/search?type=track&q=' + term;
            try { //get request to API
                const response = await fetch(url, {
                    headers: {Authorization: `Bearer ${accessToken}`}
                });
                if (response.ok) { //Convert the returned response to JSON object
                    const jsonResponse = await response.json();
                    if (jsonResponse.tracks.items.length === 0) {
                        //If the JSON does not contain any tracks, return an empty array
                        return [];
                    }
                    //map the converted JSON to an array of tracks
                    return jsonResponse.tracks.items.map(item => {return {id: item.id, name: item.name, artist: item.artists[0].name, album: item.album.name, uri: item.uri}});
                }
                //throw new Error('Request failed!');
            } catch(error) {
                console.log('search failed', error);
                return [];
            }
    }, 

    async savePlaylist(name, tracks) {
        if (!name || tracks.length===0) {
            console.log('miss datain savePlaylist')
            return;
        }
        
        const token = accessToken;
        //const headers = {Authorization: `Bearer ${token}`};
        let userID;
        let playlistID;

        const url = 'https://api.spotify.com/v1/me';
        try { //get request to API for userID
            const response = await fetch(url, { headers: {Authorization: `Bearer ${token}`} });
            if (response.ok) { //Convert the returned response to JSON object
                const jsonResponse = await response.json();
                //console.log(jsonResponse.id);
                userID = jsonResponse.id;
                console.log('success request userID', userID);
            }
            //throw new Error('Request failed!');
        } catch(error) {
            console.log(error);
            return;
        }

        const newUrl = 'https://api.spotify.com/v1/users/' + userID + '/playlists';
        //post request to create a playlist
        try {
            const responsePOST = await fetch(newUrl, { headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify({name: name}) });
                if (responsePOST.ok) {
                    //console.log('second fetch ok');
                    const jsonResponse = await responsePOST.json();
                    playlistID = jsonResponse.id;
                    //console.log(jsonResponse);
                }
            } catch(error) {
                console.log(error);
                return;
            }

        const lastUrl = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        //post request to add tracks to the playlist
        try {
            const lastResponsePOST = await fetch(lastUrl, { headers: {Authorization: `Bearer ${token}`}, method: 'POST', body: JSON.stringify({uris: tracks}) });
                if (lastResponsePOST.ok) {
                    console.log('playlist posted!');
                }
            } catch(error) {
                console.log(error);
            }
    }
};