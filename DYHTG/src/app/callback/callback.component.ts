import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Buffer } from 'buffer'; // Import Buffer for base64 encoding

@Component({
  selector: 'app-callback',
  template: `<p>Handling Spotify callback...</p>`,
})
export class CallbackComponent implements OnInit {
  private clientId: string = '0fe50e3d0be1465d966d67e6529ab620';
  private clientSecret: string = '5d44fb021c484de49a0443d476c75d6e';
  private redirectUri: string = 'http://localhost:4200/callback';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Extract authorization code and state from query parameters
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];

      if (!code || !state) {
        // If the state or code is missing, redirect with an error
        this.router.navigate(['/'], {
          queryParams: { error: 'state_mismatch' }
        });
      } else {
        // Exchange authorization code for access token
        this.exchangeCodeForToken(code);
      }
    });
  }

  exchangeCodeForToken(code: string): void {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
      code: code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
    });

    // POST request to exchange code for token
    this.http.post(tokenUrl, body.toString(), { headers }).subscribe(
      (response: any) => {
        console.log('Access Token:', response.access_token);
        // Redirect or store tokens after success
        this.router.navigate(['/'], {
          queryParams: {
            access_token: response.access_token,
            refresh_token: response.refresh_token
          }
        });
      },
      error => {
        console.error('Error fetching token:', error);
        // Redirect with an error message
        this.router.navigate(['/'], {
          queryParams: { error: 'invalid_token' }
        });
      }
    );
  }
}
