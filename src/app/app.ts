import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UpComp } from './up-comp/up-comp';
import { Match } from './match/match';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cricinfo-clone');
}
