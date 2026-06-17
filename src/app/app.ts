import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './NavBar/nav/nav';

// import { UpComp } from './up-comp/up-comp';
// import { Match } from './match/match';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,

})
export class App {
  
}
