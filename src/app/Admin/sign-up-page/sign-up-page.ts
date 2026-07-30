import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../admin-login/admin-service';
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

    const admin = {
      userName: this.adminForm.value.username,
      password: this.adminForm.value.password,

      firstName: this.adminForm.value.fname,
      lastName: this.adminForm.value.lname,

      email: this.adminForm.value.email,
      gender: this.adminForm.value.gender,
      mobileNo: this.adminForm.value.mobileNo,
      role: this.adminForm.value.role,
      address: this.adminForm.value.address,
      dob: this.adminForm.value.dob,
    };

    console.log('REQUEST:', admin);

    this.adminService.createAdmin(admin).subscribe({
      next: (response) => {
        console.log('SUCCESS RESPONSE:', response);

        alert('Admin Registered Successfully');

        this.adminForm.reset();

        this.generatePassword();
      },

      error: (err) => {
        console.log('ERROR RESPONSE:', err);

        alert(err.error ?? 'Failed to Register Admin');
      },
    });
  }
}
