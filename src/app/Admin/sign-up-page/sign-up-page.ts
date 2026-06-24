import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../../admin-login/admin-service';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css',
})
export class Signup {
  private adminService = inject(AdminService);

  adminForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),

    password: new FormControl('', Validators.required),

    fname: new FormControl('', Validators.required),

    lname: new FormControl('', Validators.required),

    email: new FormControl('', [Validators.required, Validators.email]),

    gender: new FormControl('', Validators.required),

    mobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),

    role: new FormControl('', Validators.required),

    address: new FormControl('', [Validators.required, Validators.minLength(10)]),

    dob: new FormControl('', Validators.required),
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
      this.adminForm.markAllAsTouched();
      return;
    }

    this.adminService.getAdmins().subscribe({
      next: (admins: any[]) => {
        const nextId =
          admins.length === 0 ? 1 : Math.max(...admins.map((admin) => Number(admin.id) || 0)) + 1;

        const admin = {
          id: String(nextId),
          userName: this.adminForm.value.username,
          passWord: this.adminForm.value.password,

          fname: this.adminForm.value.fname,
          lname: this.adminForm.value.lname,
          email: this.adminForm.value.email,
          gender: this.adminForm.value.gender,
          mobileNo: this.adminForm.value.mobileNo,
          role: this.adminForm.value.role,
          address: this.adminForm.value.address,
          dob: this.adminForm.value.dob,

          firstLogin: true,
        };

        this.adminService.createAdmin(admin).subscribe({
          next: () => {
            alert('Admin Registered Successfully');

            this.adminForm.reset();

            this.generatePassword();
          },
          error: (err) => console.error(err),
        });
      },
      error: (err) => console.error(err),
    });
  }
}
