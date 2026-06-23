import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from './admin-service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
 username = '';
  password = '';

  constructor(
    private authService: AdminService,
    private router: Router,
  ) {}

  login() {

    this.authService.getAdmins().subscribe((users) => {

      const user = users.find(
        x =>
          x.userName === this.username &&
          x.passWord === this.password
      );

      if (user) {

        this.authService.setAuthenticated(true);

        // this.router.navigate(['/admin/summa']);    use user which have to make route

      } else {

        alert('Invalid Username or Password');

      }

    });

  }
}