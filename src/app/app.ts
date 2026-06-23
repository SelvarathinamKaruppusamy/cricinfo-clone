import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './NavBar/nav/nav';
import { Signup } from './Admin/Sign up/sign-up-page/sign-up-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav,Signup],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
}
