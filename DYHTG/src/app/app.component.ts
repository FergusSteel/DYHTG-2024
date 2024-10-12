import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  standalone: true,
		imports: [RouterOutlet, NgxGraphModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string;

  userModel: any = {
    playlists: [],
  };

  constructor() {
    this.title = 'Crescendo';

  }

  parsePlaylistIDs(response: any) {
    let parsed = [];
    let names = [];

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

    return parsed;
  }

  getTrackGenres(track:any) {
    let artistId = this.parseTrackArtist(track);
    // let artist = await getArtistUsingArtistId(artistId);
    // let genres = this.parseArtistGenres(artist);
    // return genres
    return []
  }

  parseTrackArtist(track: any) {
    return track.artists[0].id;
  }

  parseArtistGenres(artist: any) {
    return artist.genres;
  }
}
