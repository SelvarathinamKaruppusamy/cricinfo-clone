import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UpcService } from '../../User/UpCommingPage/up-comp/upc-service';
import { updateMatch } from '../../User/UpCommingPage/match/match.models/match.models-module';
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

  matchForm = new FormGroup({
    venue: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
  });

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

        this.snackBar.open('Match Updated Successfully', 'Close', { duration: 3000 });

        this.loadMatches();

        this.selectedMatch = null;
        this.selectedMatchNo = null;
      },
      error: () => {
        this.dialog.closeAll();

        this.snackBar.open('Update Failed', 'Close', { duration: 3000 });
      },
    });
  }
}
