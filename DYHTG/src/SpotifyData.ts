export {
    getUserProfile,
    getPlaylist,
    getArtistsUsingArtistId,
    getAccessToken,
    getUserPlaylist,
} // makin it a module
const clientId = '0fe50e3d0be1465d966d67e6529ab620';
const clientSecret = undefined; 
const statusCode = undefined;

// if(!statusCode){
//     redirectToSpotifyAuth();
// }
// else{
//     const token =  getAccessToken(clientId);
//     const profile =  getUserProfile(token);
//     const userId = profile.display_name;
//     const playlist = await getUserPlaylist(token,userId);
// }

async function redirectToSpotifyAuth(){

}

async function getAccessToken(clientId : string){
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        },
      }).then((result) => {return result.json()})
}

async function getUserProfile(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    const data = await response.json();
    return data;
  }


async function getUserPlaylist(token:string, userId:string){
    return fetch("https://api.spotify.com/v1/users/"+ userId + "/playlists", {
        method: "GET", 
        headers:{ 
            Authorization: `Bearer ${token}`
        }
    }).then((result) => {return result.json()})

}

async function getPlaylist(token: string, playlistId:string){
    return fetch("https://api.spotify.com/v1/playlists/"+playlistId, {
        method: "GET",
        headers:{
            Authorization: `Bearer ${token}`
        }
    }).then((result) => {return result.json()})

    
}

async function getTrackFromPlaylist(token: string, playlistId: string){
    fetch("https://api.spotify.com/v1/playlists/"+ playlistId +"/tracks",{
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((result) => {return result.json()});
}

async function getArtistsUsingArtistId(token:string, artistid: string){
    return fetch("https://api.spotify.com/v1/artists/" + artistid, {
        method: "GET",
        headers:{
            Authorization: `Bearer ${token}`   
        }
    }).then((result) => {return result.json()});
}
