import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LiveService } from '../../../User/LivePages/Services/live-service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // Add this import
import { AdminService } from '../../admin-login/admin-service';

@Component({
  selector: 'app-sidenav-live',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatCardModule, 
    RouterLink, 
    RouterLinkActive, 
    MatMenuModule,
    MatDividerModule // Add this
  ],
  templateUrl: './sidenav-live.html',
  styleUrl: './sidenav-live.css',
})
export class SidenavLive implements OnInit {
  service = inject(LiveService);
  adminservice = inject(AdminService);
  router = inject(Router);
  
  innings = computed(() => this.service.innings());
  user: any;

  ngOnInit(): void {
    this.user = this.adminservice.getCurrentUser();
  }

  logout(): void {

  console.log("Logout clicked");

  this.adminservice.logout().subscribe({

    next: (res) => {

      console.log("Logout Success", res);

      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');

      this.router.navigate(['/admin']);
    },

    error: (err) => {

      console.log("Logout Error", err);

      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');

      this.router.navigate(['/admin']);
    }

  });

  }
}