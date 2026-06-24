import { Component, OnInit, inject, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { UpcService } from '../../UpCommingPage/up-comp/upc-service';
import { updateMatch } from '../../UpCommingPage/match/match.models/match.models-module';

import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule
  ],
  templateUrl: './upcome.html',
  styleUrl: './upcome.css',
})
export class Upcome implements OnInit {

  service = inject(UpcService);
  cd = inject(ChangeDetectorRef);
  snackBar = inject(MatSnackBar);
  dialog = inject(MatDialog);

  matches: updateMatch[] = [];

  selectedMatch: updateMatch | null = null;
  selectedMatchNo: number | null = null;

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  ngOnInit(): void {
    this.loadMatches();
  }

  loadMatches(): void {
    this.service.getMatch().subscribe({
      next: (data: updateMatch[]) => {
        this.matches = data;
        this.cd.detectChanges();
      },
      error: (error) => console.error(error)
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
      position: { top: '20%' }
    });

  }

  confirmUpdate(): void {
    if (!this.selectedMatch) return;

    this.service.updateMatch(this.selectedMatch.id, this.selectedMatch)
      .subscribe({
        next: () => {
          this.dialog.closeAll();

          this.snackBar.open(
            'Match Updated Successfully',
            'Close',
            { duration: 3000 }
          );

          this.loadMatches();
           this.selectedMatch = null;
  this.selectedMatchNo = null;
        },
        error: () => {
          this.dialog.closeAll();

          this.snackBar.open(
            'Update Failed',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }
}