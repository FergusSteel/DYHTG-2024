const clientId = '0fe50e3d0be1465d966d67e6529ab620';
const clientSecret = undefined; 
const statusCode = undefined;

if(!statusCode){
    redirectToSpotifyAuth();
}
else{
    const token = await getAccessToken(clientId, statusCode);
    const profile = await getUserProfile(token);
    const userId = profile.display_name;
}

async function redirectToSpotifyAuth(){

}

async function getAccessToken(clientId : string , statusCode: string){
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        },
      });
    
      return await response.json();
}

async function getUserProfile(token: string){
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function getUserPlaylist(token:string, userId:string){
    const result = await fetch("https://api.spotify.com/v1/users/"+ userId + "/playlists", {
        method: "GET", 
        headers:{ 
            
        }
    });
}
    
     