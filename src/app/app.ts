import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './NavBar/nav/nav';
import { AdminLogin } from './admin-login/admin-login';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
}
