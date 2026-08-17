import { Component, Inject } from "@angular/core";
import { LiveModel } from "../../../User/LivePages/Models/models";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-promote-dialog',
  templateUrl: './promote-match-dialog-component.html',
  imports: [
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ]
})
export class PromoteMatchDialogComponent {

  constructor(

    @Inject(MAT_DIALOG_DATA)
    public data: LiveModel

  ){}

}