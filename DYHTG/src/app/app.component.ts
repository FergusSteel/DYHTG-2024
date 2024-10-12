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


  constructor() {
    this.title = 'Crescendo';

  }

}
