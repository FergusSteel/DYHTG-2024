import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getUserProfile, getUserPlaylist, getPlaylist, getArtistsUsingArtistId } from '../SpotifyData';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GraphComponent } from './graph/graph.component';
import { profile } from 'console';
import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,GraphComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Crescendo';
  userToken: string = '';

  userModel: any = {};
  graph: any = undefined;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.userModel = {playlists: []};
    
  }

  ngOnInit(): void {
    // Listen for query parameters on app initialization to handle token after redirect
    this.route.queryParams.subscribe(params => {
      if (params['access_token']) {
        console.log('receiving access token')
        this.onLoginSuccess(params['access_token']);
      }
    });
    this.graph = new GraphComponent();  
  }

  async onLoginSuccess(token: string): Promise<void> {
    console.log('Login Success with token:', token);
    this.userToken = token;
    this.graph.hideComponent = false;
    await this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    try {
      const profileResponse = await getUserProfile(this.userToken);
      const userId = profileResponse.id;
      await this.loadUserPlaylists(userId);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async loadUserPlaylists(userId: string): Promise<void> {
    try {
      const playlistResponse = await getUserPlaylist(this.userToken, userId);
      const playlistIds = this.parsePlaylistIDs(playlistResponse);

      // Load tracks for each playlist
      for (const playlistId of playlistIds) {
        const playlist = await getPlaylist(this.userToken, playlistId);
        const tracks = await this.parseTracksIds(playlist);
        this.userModel.playlists.push({
          "name": playlist.name,
          "tracks": tracks,
          "img": playlist.images[0].url || "",
        });
      }
      for (let pl of this.userModel.playlists) {
        console.log("name: " + pl.name + ", tracks: [");
        for (let track of pl.tracks) {
          console.log("{ name: "+track.name+", genres: ["+track.genres+"], img: "+track.img+"}");
        }
        console.log("}")
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  }

  parsePlaylistIDs(response: any): string[] {
    const parsed = response.items.map((playlist: any) => {
      return playlist.id;
    });


    return parsed;
  }

  async parseTracksIds(playlist: any) {
    let tracks = []
    let artists = "?ids=";
    if (!(playlist.tracks.items.length > 50)) {
      // get list of artists
      for (const track of playlist.tracks.items) {
        // console.log(track.track.artists);
        artists = artists.concat(track.track.artists[0].id+",");
      }
      if (artists == "?ids=") {
        return [];
      }
      artists = artists.slice(0, -1);

      const data = await getArtistsUsingArtistId(this.userToken, artists);
      
      let artistMap = new Map<string, string[]>();
      for (const artist of data.artists) {
        artistMap.set(artist.id, artist.genres);
      }

      for (const track of playlist.tracks.items) {
        const trackInfo = {
          name: track.track.name,
          genres: artistMap.get(track.track.artists[0].id) || [], // Use the genres from the artist map
          img: track.track.album.images[0].url || "",
        };
        tracks.push(trackInfo);
      }
      return tracks;  
    } else {
      return [];
    }
  }

  // async getTrackGenres(track: any){
  //   const genres = await getArtistUsingArtistId(this.userToken, track.track.artists[0].id);
  //   // console.log(genres)
  //   return genres.genres ?? [];
  // }

  // parseTrackArtist(track: any): string {
  //   return track.track.artists[0].id || '';
  // }

  // parseArtistGenres(artist: any): string[] {
  //   return artist.genres || [];
  // }
}
