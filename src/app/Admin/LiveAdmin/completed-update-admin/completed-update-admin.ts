import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { LiveService } from '../../../User/LivePages/Services/live-service';
import { LiveModel, Player } from '../../../User/LivePages/Models/models';
import { AdminService } from '../admin-service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../confirm-dialog-component/confirm-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-completed-update-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './completed-update-admin.html',
  styleUrl: './completed-update-admin.css',
})
export class CompletedUpdateAdmin implements OnInit {
  liveService = inject(LiveService);
  transitionService = inject(AdminService);
  changedetection = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  live = computed(() => this.liveService.live());
  upcomingPreview = signal<LiveModel | null>(null);

  resultText = '';
  playerOfMatch = '';
  toastVisible = false;
toastType: 'success' | 'error' = 'success';
toastMessage = '';

private toastTimer: any;

  allPlayers = computed<Player[]>(() => {
    const live = this.live();
    if (!live) return [];
    const winner=this.findwinner();
    if(winner===live.teams[0].shortName){
      return[...live.teams[0].players,...live.teams[1].players]
    }
    return [...live.teams[1].players,...live.teams[0].players];
  });
  findwinner(): string {
  const live = this.live();
  if (!live) return '';

  return live.teams[0].scores > live.teams[1].scores
    ? live.teams[0].shortName
    : live.teams[1].shortName;
}

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

  ngOnInit(): void {
    if (!this.liveService.live()) {
      this.liveService.GetLiveMatch().subscribe({
  next: (match) => {
    this.liveService.loadMatchIntoService(match);
    this.changedetection.detectChanges();
  },
  error: (err: any) => console.error(err),
});
    }

    this.loadUpcomingPreview();
  }

  loadUpcomingPreview() {
    this.transitionService.GetUpcomingMatches().subscribe({
      next: (res) => {
        this.upcomingPreview.set(res?.length ? res[0] : null);
        this.changedetection.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  autoGenerateResult() {

  const live = this.live();

  if (!live) return;

  this.resultText = live.result ?? '';

}

completeMatch() {
console.log("completed")
  this.openConfirmDialog(
    {
      title: 'Completed Status Update',
      message: 'Complete this match?',
      confirmText: 'Complete',
      cancelText: 'Cancel',
      type: 'success'
    },
    () => {

      const live = this.live();

      if (!live) return;

      if (!this.playerOfMatch.trim()) {

        this.showToast(
          'Please select Player of the Match',
          'error'
        );

        return;
      }

      this.liveService.CompleteMatch({

        matchNo: live.matchNo,

        playerOfTheMatch: this.playerOfMatch

      }).subscribe({

        next: () => {

          this.showToast(
            'Match Completed Successfully',
            'success'
          );

          this.liveService.GetLiveMatch()
            .subscribe(match => {

              this.liveService.loadMatchIntoService(match);

            });

        },

        error: err => {

          console.error(err);

          this.showToast(
            'Unable to complete match',
            'error'
          );

        }

      });

    }
  );

}
  showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  this.changedetection.detectChanges();
  clearTimeout(this.toastTimer);

  this.toastTimer = setTimeout(() => {
    this.toastVisible = false;
    this.changedetection.detectChanges();
  }, 1200);
}
closeToast() {
  this.toastVisible = false;
  clearTimeout(this.toastTimer);
}
}