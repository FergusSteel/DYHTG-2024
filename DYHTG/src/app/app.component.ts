import { Component, HostListener, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import {getUserProfile, getUserPlaylist, getPlaylist, getArtistUsingArtistId} from "../SpotifyData";

@Component({
  selector: 'app-root',
  standalone: true,
		imports: [RouterOutlet, NgxGraphModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string;
  userToken: string = "";

  userModel: any = {
    playlists: [],
  };

  @HostListener('onLoginSuccess', ['$event'])
  onLoginSuccess(OAuth: any) {
    this.userToken = OAuth.token;
    // Populate User Model
    getUserProfile(this.userToken).then((response) => {
      let userId = response.id;
      getUserPlaylist(this.userToken, userId).then((response) => {
        let playlistIds = this.parsePlaylistIDs(response);
        for (let playlistId of playlistIds) {
          getPlaylist(this.userToken, playlistId).then((response) => {
            this.parseTracksIds(response);
          });
          
        }
      });
    });

    console.log(this.userModel);
    return;
  }

  constructor() {
    this.title = 'Crescendo';
  }

  parsePlaylistIDs(response: any) {
    let parsed = [];

    for (let playlist of response.items) {
      parsed.push(playlist.id);
      let name = playlist.name;
      this.userModel.playlists.push({name: {tracks: []}});
    } 
    
    if (response.next) {
      response = fetch(response.next, {}); 
      parsed.concat(this.parsePlaylistIDs(response));
    } 

    return parsed;
  }

  parseTracksIds(playlist: any) {
    let parsed = [];

    for (let track of playlist.tracks.items) {
      parsed.push(track.track.id);
      let name = track.track.name;
      this.userModel.playlists[playlist.id].tracks.push({name: {genres: this.getTrackGenres(track)}});
    }

    if (playlist.next) {
      let nextPage = fetch(playlist.next, {});
      parsed.concat(this.parseTracksIds(nextPage));
    }
  }

  getTrackGenres(track:any) {
    let artistId = this.parseTrackArtist(track);
    let artist = getArtistUsingArtistId(this.userToken, artistId);
    let genres = this.parseArtistGenres(artist);
    return genres
  }

  parseTrackArtist(track: any) {
    return track.artists[0].id;
  }

  parseArtistGenres(artist: any) {
    return artist.genres;
  }
}
