import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LiveService } from '../../../LivePages/Services/live-service';

@Component({
  selector: 'app-sidenav-live',
  imports: [CommonModule, MatIconModule, MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav-live.html',
  styleUrl: './sidenav-live.css',
})
export class SidenavLive {
  service=inject(LiveService)
  innings=computed(()=>this.service.innings())
}
