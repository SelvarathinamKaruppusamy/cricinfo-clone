import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from './User/NavBar/nav/nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public router: Router) {}

  showUserNav(): boolean {
    return !this.router.url.startsWith('/admin') && !this.router.url.startsWith('/navbarAdmin');
  }
}
