import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Squads } from './squads/squads';
import { Nav } from './nav/nav';
// import { UpComp } from './up-comp/up-comp';
// import { Match } from './match/match';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,

})
export class App {
  
}
