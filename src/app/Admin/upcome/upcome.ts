import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { UpcService } from '../../User/UpCommingPage/up-comp/upc-service';
import { updateMatch } from '../../User/UpCommingPage/match/match.models/match.models-module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upcome',
  standalone: true,
  imports: [
    CommonModule,
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
  ],
  templateUrl: './upcome.html',
  styleUrl: './upcome.css',
})
export class Upcome implements OnInit, OnDestroy {
  service = inject(UpcService);
  cd = inject(ChangeDetectorRef);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  matches: updateMatch[] = [];

  selectedMatch: updateMatch | null = null;
  selectedMatchNo: number | null = null;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  ngOnInit(): void {
    this.loadMatches();
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
  }

  prepareUpdate(venue: string, city: string, date: string, status: string): void {
    if (!this.selectedMatch) return;

    this.selectedMatch.venue = venue;
    this.selectedMatch.city = city;
    this.selectedMatch.date = date;
    this.selectedMatch.status = status;
  }

  saveMatch(): void {
    if (!this.selectedMatch) return;

    this.dialog.open(this.confirmDialog, {
      width: '360px',
      disableClose: true,
      position: { top: '20%' },
    });
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
}
