import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface EditLastBallDialogData {
  currentBall: string;
}

@Component({
  selector: 'app-edit-last-ball-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './edit-last-ball-dialog-component.html',
})
export class EditLastBallDialogComponent {
  ballOptions = ['0', '1', '2', '3', '4', '6', 'W', 'Wd', 'Nb'];
  selectedBall: string;

  constructor(
    public dialogRef: MatDialogRef<EditLastBallDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditLastBallDialogData
  ) {
    this.selectedBall = data.currentBall;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.selectedBall);
  }
}