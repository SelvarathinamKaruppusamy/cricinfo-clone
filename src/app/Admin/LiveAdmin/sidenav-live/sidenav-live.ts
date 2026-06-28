import { CommonModule } from '@angular/common';
import {Component, computed, inject, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LiveService } from '../../../User/LivePages/Services/live-service';
import { MatMenuModule } from '@angular/material/menu';
import { AdminService } from '../../admin-login/admin-service';

@Component({
  selector: 'app-sidenav-live',
  imports: [CommonModule, MatIconModule, MatCardModule, RouterLink, RouterLinkActive,MatMenuModule],
  templateUrl: './sidenav-live.html',
  styleUrl: './sidenav-live.css',
})
export class SidenavLive implements OnInit {
  service=inject(LiveService)
  adminservice=inject(AdminService)
  router=inject(Router)
  innings=computed(()=>this.service.innings())
  user:any
  ngOnInit(): void {
    this.user= this.adminservice.getCurrentUser()
  }
  logout(): void {
    this.adminservice.logout();

    this.router.navigate(['/admin']);
  }
}
