import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // HttpClient to handle HTTP requests
import { Router } from '@angular/router'; // Router to handle redirection


@Component({
  selector: 'app-login',
  standalone: true, // Standalone component
  template: `<button (click)="login()">Login with Spotify</button>`,
  imports: [], // If you're using standalone, add HttpClientModule in main.ts
})
export class LoginComponent {

  private clientId: string = '0fe50e3d0be1465d966d67e6529ab620'; // NEED TO CHANGE BACK TO MIGUELS
  private redirectUri: string = 'http://localhost:4200/callback'; // Your Angular app's callback route
  private scope: string = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

  constructor(
    private http: HttpClient, // HttpClient to handle HTTP requests
    private router: Router // Router for navigation
  ) {}

 generateRandomString(length: number): string {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Login function triggered by button click
  login() {
    const state: string = this.generateRandomString(16); // Generate a random state
    const authorizationUrl = 'https://accounts.spotify.com/authorize';

    // Create parameters for the Spotify authorization request
    const params = new HttpParams()
      .set('response_type', 'code')
      .set('client_id', this.clientId)
      .set('scope', this.scope)
      .set('redirect_uri', this.redirectUri)
      .set('show_dialog', true)
      .set('state', state);

    // Redirect the user to the Spotify authorization page
    window.location.href = `${authorizationUrl}?${params.toString()}`;
  }
}
