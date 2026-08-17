import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLoginService } from '../admin-login/admin-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private cd = inject(ChangeDetectorRef);

  user: any;
  editUser: any;
  editMode = false;
  isSuperAdmin = false;
  showConfirmDialog = false;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  constructor(
    private adminService: AdminLoginService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    const currentUser = this.adminService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/admin']);
      return;
    }

    this.adminService.getProfile(currentUser.userName).subscribe({
      next: (res: any) => {

        this.user = res;

        this.editUser = {
          ...res,
        };

        this.isSuperAdmin = res.role === 'Super Admin';

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

 logout(): void {

  console.log("Logout clicked");

  this.adminService.logout().subscribe({

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

  addadmin(): void {
    this.router.navigate(['/navbarAdmin/signup']);
  }

  enableEdit(): void {
    this.editMode = true;
    this.editUser = { ...this.user };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editUser = { ...this.user };
  }

  saveProfile(): void {
    this.showConfirmDialog = true;
  }

  confirmSave(): void {
    this.showConfirmDialog = false;

    this.adminService.updateProfile(this.user.id, this.editUser).subscribe({
      next: (res: any) => {
        this.user = {
          ...this.editUser,
        };

        this.editMode = false;

        this.showToast('Profile Updated Successfully', 'success');

        console.log(res);
      },

      error: (err) => {
        console.log(err);

        this.showToast('Profile Update Failed', 'error');
      },
    });
  }
  cancelSave(): void {
    this.showConfirmDialog = false;
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cd.detectChanges();

    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
      this.cd.detectChanges();
      this.toastTimeout = null;
    }, 3000);
  }

  closeToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastVisible = false;
    this.cd.detectChanges();
  }
}
