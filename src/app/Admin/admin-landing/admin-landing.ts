import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-admin-landing',
  imports: [RouterOutlet,NavBar],
  templateUrl: './admin-landing.html',
  styleUrl: './admin-landing.css',
})
export class AdminLanding {}
