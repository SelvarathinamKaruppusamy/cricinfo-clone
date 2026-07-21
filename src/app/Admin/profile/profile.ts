import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../admin-login/admin-service';

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
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.user = this.adminService.getCurrentUser();
    this.editUser = { ...this.user };
    this.isSuperAdmin = this.user?.role === 'Super Admin';
  }

  logout(): void {
    this.adminService.logout();
    this.router.navigate(['/admin']);
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

    const updatedUser = { ...this.editUser };

    this.adminService.updateAdmin(this.user.id, updatedUser).subscribe({
      next: (response: any) => {
        this.user = { ...updatedUser };
        this.editUser = { ...updatedUser };
        this.adminService.setCurrentUser(updatedUser);
        this.editMode = false;
        this.cdr.markForCheck();

        this.showToast('Profile Updated Successfully', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showToast('Update failed. Please try again.', 'error');
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