import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PointsTable } from "./points-table/points-table";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cricinfo-clone');
}
