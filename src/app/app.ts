import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from './User/NavBar/nav/nav';
import { AdminService } from './Admin/LiveAdmin/admin-service';
import { AdminLoginService } from './Admin/admin-login/admin-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(public router: Router ,private adminService: AdminLoginService) {}

  showUserNav(): boolean {
    return !this.router.url.startsWith('/admin') && !this.router.url.startsWith('/navbarAdmin');
  }
  ngOnInit(): void {
    if (this.adminService.isAuthenticated()) {
      if (this.adminService.isTokenExpired()) {
        this.adminService.clearLocalSession();
      } else {
        this.adminService.scheduleAutoLogout();
      }
    }
  }
}
