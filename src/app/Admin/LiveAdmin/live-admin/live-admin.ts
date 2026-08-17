import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidenavLive } from '../sidenav-live/sidenav-live';
import { NavBar } from '../../nav-bar/nav-bar';

@Component({
  selector: 'app-live-admin',
  imports: [RouterOutlet, SidenavLive, NavBar],
  templateUrl: './live-admin.html',
  styleUrl: './live-admin.css',
})
export class LiveAdmin {}
