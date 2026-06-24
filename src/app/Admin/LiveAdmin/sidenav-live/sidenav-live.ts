import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav-live',
  imports: [CommonModule, MatIconModule, MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav-live.html',
  styleUrl: './sidenav-live.css',
})
export class SidenavLive {}
