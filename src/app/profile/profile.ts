import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../admin-login/admin-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user: any;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.adminService.getCurrentUser();
  }

  logout(): void {
    this.adminService.logout();

    this.router.navigate(['/admin']);
  }
  addadmin() {
    this.router.navigate(['/navbarAdmin/signup']);
  }
}
