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
  this.authService.getAdmins().subscribe((users) => {

    const user = users.find(
      (x) =>
        x.userName === this.username &&
        x.passWord === this.password
    );

    if (!user) {
      alert('Invalid Username or Password');
      return;
    }

    this.authService.setAuthenticated(true);

    this.authService.setCurrentUser(user);

    // this.router.navigate(['/profile']);   us the nav route
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
    this.authService.getAdmins().subscribe((users) => {
      const user = users.find(
        (x) =>
          (x.userName === this.resetUsername || x.username === this.resetUsername) &&
          (x.passWord === this.currentPassword || x.password === this.currentPassword),
      );

      if (!user) {
        alert('Invalid Username or Current Password');
        return;
      }

      if (!user.firstLogin) {
        alert('Password change not allowed');
        return;
      }

      const updatedUser = {
        ...user,
        passWord: this.newPassword,
        password: this.newPassword,
        firstLogin: false,
      };

      this.authService.updateAdmin(user.id, updatedUser).subscribe(() => {
        alert('Password Updated Successfully');
        this.cancelReset();
      });
    });
  }
}
