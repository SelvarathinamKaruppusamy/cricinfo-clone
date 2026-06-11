import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Squads } from './squads/squads';
import { Nav } from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [Squads, RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('cricinfo-clone');
}
