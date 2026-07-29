import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { LiveService } from '../../../User/LivePages/Services/live-service';
import { LiveModel, Team } from '../../../User/LivePages/Models/models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog-component/confirm-dialog-component';
import { AdminService } from '../admin-service';
import { PromoteMatchDialogComponent } from '../promote-match-dialog-component/promote-match-dialog-component';

@Component({
  selector: 'app-toss-panel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './toss-panel.html',
  styleUrl: './toss-panel.css',
})
export class TossPanel implements OnInit {
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  router = inject(Router);
  adminService=inject(AdminService)
  live!: LiveModel;
  teams: Team[] = [];

  selectedTossWinner: 0 | 1 | null = null;
  selectedCall: 'Head' | 'Tail' | null = null;
  selectedDecision: 'Bat' | 'Bowl' | null = null;
  toastVisible = false;
toastType: 'success' | 'error' = 'success';
toastMessage = '';

private toastTimer: any;
selectedUpcomingMatch!: LiveModel;

   private dialog = inject(MatDialog);
  openConfirmDialog(data: ConfirmDialogData, action: () => void) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        action();
      }
    });
  }
ngOnInit(): void {

 // Temporary while only one live match exists
this.openPromoteDialog();

}
loadLiveMatch(match: LiveModel) {

  this.live = structuredClone(match);

  this.teams = this.live.teams;

  this.service.loadMatchIntoService(this.live);

  this.changedetector.detectChanges();

}
openPromoteDialog() {

  this.adminService.GetUpcomingMatches().subscribe({

    next: (matches) => {

      if (!matches.length) {

        alert("No Upcoming Matches");

        return;

      }

      const nextMatch = matches[0];
      console.log(matches)

this.selectedUpcomingMatch = nextMatch;

      const dialogRef = this.dialog.open(
        PromoteMatchDialogComponent,
        {
          width: '500px',
          disableClose: true,
          data: nextMatch
        }
      );

      dialogRef.afterClosed().subscribe(result => {

        if (result) {

          this.promoteMatch();

        }

      });

    }

  });

}
promoteMatch() {

  this.adminService
      .PromoteUpcomingMatch(this.selectedUpcomingMatch.matchNo)
      .subscribe({

        next: () => {

          this.showToast(
            "Match Promoted Successfully",
            "success"
          );

          this.service.GetLiveMatch(
            
          ).subscribe({

            next: match => {

              this.loadLiveMatch(match);

            }

          });

        },

        error: err => {

          console.error(err);

          this.showToast(
            "Promotion Failed",
            "error"
          );

        }

      });

}
  get tossSummary(): string {
    if (this.selectedTossWinner === null || !this.selectedCall || !this.selectedDecision) {
      return '';
    }

    const winner = this.live?.teams[this.selectedTossWinner]?.shortName ?? '';
    const decisionText = this.selectedDecision === 'Bat' ? 'bat first' : 'bowl first';

    return `${winner} won the toss (${this.selectedCall}) and elected to ${decisionText}.`;
  }

  selectTossWinner(index: 0 | 1) {
    this.selectedTossWinner = index;
  }

  selectCall(call: 'Head' | 'Tail') {
    this.selectedCall = call;
  }

  selectDecision(decision: 'Bat' | 'Bowl') {
    this.selectedDecision = decision;
  }

  canSaveToss(): boolean {

  return this.selectedTossWinner !== null &&
         this.selectedDecision !== null;

}

 saveToss() {

  this.openConfirmDialog(
    {
      title: 'Save Toss',
      message: 'Do you want to save the toss?',
      confirmText: 'Save',
      cancelText: 'Cancel',
      type: 'success'
    },
    () => {

      if (!this.live) return;

      const body = {

        tossWinner:
          this.live.teams[this.selectedTossWinner!].shortName,

        tossDecision:
          this.selectedDecision

      };

      this.service.UpdateToss(
        this.live.matchNo,
        body
      ).subscribe({

        next: () => {

          // CALL START MATCH API
          this.service.StartMatch(this.live!.matchNo).subscribe({

            next: () => {

              // Reload latest match
              this.service.GetLiveMatch(
                
              ).subscribe({

                next: (updatedMatch) => {

                  this.service.isSaving = true;

                  this.loadLiveMatch(updatedMatch);

                  this.showToast(
                    'Toss Saved & Match Started',
                    'success'
                  );

                  setTimeout(() => {

                    this.router.navigate([
                      '/navbarAdmin/adminLive/liveupdate'
                    ]);

                  }, 1500);

                },

                error: (err: any) => {

                  console.error(err);

                }

              });

            },

            error: (err: any) => {

              console.error(err);

              this.showToast(
                'Match start failed',
                'error'
              );

            }

          });

        },

        error: (err: any) => {

          console.error(JSON.stringify(err.error));
          console.error(err);

          this.showToast(
            'Failed to save toss',
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

  this.changedetector.detectChanges();

  clearTimeout(this.toastTimer);

  this.toastTimer = setTimeout(() => {
    this.toastVisible = false;
    this.changedetector.detectChanges();
  }, 1200);
}

closeToast() {
  this.toastVisible = false;
  clearTimeout(this.toastTimer);
}
}
