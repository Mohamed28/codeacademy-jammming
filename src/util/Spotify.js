let token;
const clientId = "458ad70f7c534cc2b4f253aaecbf327f"
const redirectUri = "http://localhost:3000/"


const Spotify = {
    getAccessToken() {
        if (token) {
            return token;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            token = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return token;

        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const token = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            return response.json();

        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    savePlaylist(name, trackUris) {
        if (name && trackUris) {
            const token = Spotify.getAccessToken();
            const headers = {
                Authorization: `Bearer ${token}`
            }
            let userId;
            return fetch(`https://api.spotify.com/v1/me`, {
                headers: headers
            }).then(response => {
                return response.json();

            }).then(responseJson => {
                userId = responseJson.id
                fetch(`https://api.spotify.com/v1/users/${userId}/playlist`, {
                    method: 'POST', headers: headers, body: JSON.stringify({ name: name })

                }).then(response => {
                    return response.json();

                }).then(responseJson => {
                    const playlistId = responseJson.id
                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlist/${playlistId}/tracks`, {
                        method: 'POST', headers: headers, body: JSON.stringify({ uris: trackUris })
                    })
                })
            })

        } else {
            return;
        }

    }
}


export default Spotify;