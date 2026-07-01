import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UpcService } from '../../User/UpCommingPage/up-comp/upc-service';
import {
  stadium,
  updateMatch,
} from '../../User/UpCommingPage/match/match.models/match.models-module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../LiveAdmin/confirm-dialog-component/confirm-dialog-component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-upcome',
  standalone: true,
  imports: [
    MatListModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatOption,
    MatIcon,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './upcome.html',
  styleUrl: './upcome.css',
})
export class Upcome implements OnInit {
  service = inject(UpcService);
  cd = inject(ChangeDetectorRef);
  snackBar = inject(MatSnackBar);

  matches: updateMatch[] = [];

  selectedMatch: updateMatch | null = null;
  selectedMatchNo: number | null = null;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  matchForm = new FormGroup({
    venue: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

  Stadiums: stadium[] = [
    { venue: 'Eden Gardens', city: 'Kolakata' },
    { venue: 'M.Chinnaswamy Stadium', city: 'Bengaluru' },
    { venue: 'Narendra Modi Stadium', city: 'Ahmedabad' },
    { venue: 'M.A.Chidhambaram Stadium', city: 'Chennai' },
    { venue: 'Maharaja Yadavindra Singh', city: 'Mullanppur' },
    { venue: 'Arun Jaitley Stadium', city: 'Delhi' },
    { venue: 'Wankhede Stadium', city: 'Mumbai' },
    { venue: 'Sawai Mansingh Stadium', city: 'Jaipur' },
    { venue: 'BRASABV Ekana Cricket Stadium', city: 'Lucknow' },
    { venue: 'Arun Jaitley Stadium', city: 'Jaipur' },
  ];

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.service.getMatch().subscribe({
      next: (data: updateMatch[]) => {
        this.matches = data;
        this.cd.detectChanges();
      },
      error: (error) => console.error(error),
    });
  }

  selectMatch(match: updateMatch): void {
    this.selectedMatch = { ...match };
    this.selectedMatchNo = match.matchNo;

    this.matchForm.patchValue({
      venue: match.venue,
      city: match.city,
      date: match.date,
      status: match.status,
    });
  }

  prepareUpdate(): void {
    if (!this.selectedMatch) return;

    this.selectedMatch.venue = this.matchForm.value.venue!;
    this.selectedMatch.city = this.matchForm.value.city!;
    this.selectedMatch.date = this.matchForm.value.date!;
    this.selectedMatch.status = this.matchForm.value.status!;
  }

  private dialog = inject(MatDialog);

  openConfirmDialog(data: ConfirmDialogData, action: () => void) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        action();
      }
    });
  }
  saveMatch(): void {
    if (!this.selectedMatch || this.matchForm.invalid) {
      this.matchForm.markAllAsTouched();
      return;
    }

    this.prepareUpdate();

    this.openConfirmDialog(
      {
        title: 'Update Match',
        message: `Are you sure you want to update Match No ${this.selectedMatch.matchNo}?`,
        confirmText: 'Update',
        cancelText: 'Cancel',
        type: 'primary',
      },
      () => {
        this.confirmUpdate();
      },
    );
  }
  confirmUpdate(): void {
    if (!this.selectedMatch) return;

    this.service.updateMatch(this.selectedMatch.id, this.selectedMatch).subscribe({
      next: () => {
        this.dialog.closeAll();

        this.showToast('Match Updated Successfully', 'success');

        this.loadMatches();
        this.selectedMatch = null;
        this.selectedMatchNo = null;
      },
      error: () => {
        this.dialog.closeAll();

        this.showToast('Update Failed', 'error');
      },
    });
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
  venueChanges(venue: string) {
    const selectedStadium = this.Stadiums.find((stadium) => stadium.venue === venue);

    if (selectedStadium) {
      this.matchForm.patchValue({ city: selectedStadium.city });
    }
  }
}
