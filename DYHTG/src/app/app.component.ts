import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getUserProfile, getUserPlaylist, getPlaylist, getArtistUsingArtistId } from '../SpotifyData';
import { RouterOutlet } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { LoginComponent } from './login/login.component';
import { GraphComponent } from './graph/graph.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GraphComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Crescendo';
  userToken: string = '';

  userModel: any = {
    playlists: [],
  };

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen for query parameters on app initialization to handle token after redirect
    this.route.queryParams.subscribe(params => {
      if (params['access_token']) {
        console.log('receiving access token')
        this.onLoginSuccess(params['access_token']);
      }
    });
  }

  async onLoginSuccess(token: string): Promise<void> {
    console.log('Login Success with token:', token);
    this.userToken = token;
    await this.loadUserProfile();
    console.log(this.userModel);
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
        this.parseTracksIds(playlist);
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  }

  parsePlaylistIDs(response: any): string[] {
    const parsed = response.items.map((playlist: any) => {
      this.userModel.playlists.push({
        name: playlist.name,
        tracks: []
      });
      return playlist.id;
    });

    // Handle pagination if needed
    if (response.next) {
      fetch(response.next)
        .then(nextResponse => this.parsePlaylistIDs(nextResponse))
        .catch(error => console.error('Error fetching next page of playlists:', error));
    }

    return parsed;
  }

  parseTracksIds(playlist: any): void {
    for (const track of playlist.tracks.items) {
      const trackInfo = {
        name: track.track.name,
        genres: this.getTrackGenres(track)
      };
      // Ensure the correct playlist is updated
      const playlistEntry = this.userModel.playlists.find((p: any) => p.name === playlist.name);
      if (playlistEntry) {
        playlistEntry.tracks.push(trackInfo);
      }
    }

    // Handle pagination for tracks if needed
    if (playlist.next) {
      fetch(playlist.next)
        .then(nextPage => this.parseTracksIds(nextPage))
        .catch(error => console.error('Error fetching next page of tracks:', error));
    }
  }

  getTrackGenres(track: any): string[] {
    const artistId = this.parseTrackArtist(track);
    const artist = getArtistUsingArtistId(this.userToken, artistId);
    return this.parseArtistGenres(artist);
  }

  parseTrackArtist(track: any): string {
    return track.artists[0].id;
  }

  parseArtistGenres(artist: any): string[] {
    return artist.genres || [];
  }
}
