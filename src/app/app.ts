import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from './NavBar/nav/nav';
import { NavBar } from './Admin/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Nav, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public router: Router) {}

  showUserNav(): boolean {
    return (
      !this.router.url.startsWith('/admin') &&
      !this.router.url.startsWith('/navbarAdmin')
    );
  }
}