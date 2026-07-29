import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from './admin-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  username = '';
  password = '';

  resetUsername = '';
  currentPassword = '';
  newPassword = '';

  showResetForm = false;

  constructor(
    private authService: AdminService,
    private router: Router,
  ) {}

  login() {
    this.authService
      .login({
        userName: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token);

          this.authService.setCurrentUser(res);

          this.router.navigate(['/navbarAdmin']);
        },

        error: () => {
          alert('Invalid Username or Password');
        },
      });
  }

  openResetForm() {
    this.showResetForm = true;
  }

  cancelReset() {
    this.showResetForm = false;

    this.resetUsername = '';
    this.currentPassword = '';
    this.newPassword = '';
  }

  updatePassword() {
    this.authService
      .resetPassword({
        userName: this.resetUsername,
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (res: any) => {
          alert(res.message);

          this.cancelReset();
        },
        error: (err) => {
          alert(err.error.message);
        },
      });
  }
}
