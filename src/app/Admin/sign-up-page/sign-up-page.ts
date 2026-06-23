import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../../admin-login/admin-service';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css',
})
export class Signup {
  private adminService = inject(AdminService);

  adminForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl(''),
  });

  constructor() {
    this.generatePassword();
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

    let password = '';

    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.adminForm.patchValue({
      password,
    });
  }

  register(): void {
    if (this.adminForm.invalid) {
      return;
    }

    this.adminService.getAdmins().subscribe({
      next: (admins: any[]) => {
        const nextAdminId =
          admins.length === 0 ? 1 : Math.max(...admins.map((admin) => admin.adminId || 0)) + 1;

        const admin = {
          adminId: nextAdminId,
          username: this.adminForm.value.username,
          password: this.adminForm.value.password,
          firstLogin: true,
        };

        this.adminService.createAdmin(admin).subscribe({
          next: () => {
            alert('Admin Registered Successfully');

            this.adminForm.reset();

            this.generatePassword();
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
