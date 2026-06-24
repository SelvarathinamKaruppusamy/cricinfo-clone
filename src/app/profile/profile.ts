import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.user = this.adminService.getCurrentUser();
  }
}
