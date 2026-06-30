import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveService } from '../../../User/LivePages/Services/live-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Player, Team } from '../../../User/LivePages/Models/models';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog-component/confirm-dialog-component';
import { EditLastBallDialogComponent, EditLastBallDialogData } from '../edit-last-ball-dialog-component/edit-last-ball-dialog-component';
import { SelectBowlerDialogComponent } from '../select-bowler-dialog-component/select-bowler-dialog-component';

@Component({
  selector: 'app-live-update-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './live-update-admin.html',
  styleUrl: './live-update-admin.css',
})
export class LiveUpdateAdmin implements OnInit {
  service = inject(LiveService);
  cd = inject(ChangeDetectorRef);
  router=inject(Router)
  live = computed(() => this.service.live());
  selectedTossWinner: 0 | 1 | null = null;
  selectedCall: 'Head' | 'Tail' | null = null;
  selectedDecision: 'Bat' | 'Bowl' | null = null;
  toastVisible = false;
toastType: 'success' | 'error' = 'success';
toastMessage = '';

private toastTimer: any;

  openEditLastBallDialog() {
  const balls = this.service.currentOverBalls();
  if (!balls.length) {
    return;
  }

  const currentBall = balls[balls.length - 1];

  const dialogRef = this.dialog.open(EditLastBallDialogComponent, {
    width: '380px',
    disableClose: true,
    data: {
      currentBall,
    } as EditLastBallDialogData,
    panelClass: 'custom-dialog-container',
  });

  dialogRef.afterClosed().subscribe((newBall: string | undefined) => {
    if (!newBall || newBall === currentBall) return;

    this.service.editLastBall(newBall);
  });
}

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

  openBowlerDialog() {

  const dialogRef=this.dialog.open(
    SelectBowlerDialogComponent,
    {
      width:'400px',
      disableClose:true,
      data:{
        bowlers:this.availableBowlers()
      }
    }
  );

  dialogRef.afterClosed().subscribe(index=>{

    if(index==null) return;

    this.service.changeBowler(index);

  });

}
  currentBattingTeam = computed<Team | undefined>(() => {
    const live = this.service.live();
    if (!live) return undefined;
    return live.teams[this.service.currentBattingTeam()];
  });

  currentBowlingTeam = computed<Team | undefined>(() => {
    const live = this.service.live();
    if (!live) return undefined;
    return live.teams[this.service.currentBowlingTeam()];
  });

  currentBowler = computed<Player | undefined>(() => this.service.currentBowler);

  currentBatters = computed<Player[]>(() =>
    this.service.players1().filter((p) => p.status === 'Not Out'),
  );

  batter1 = computed<Player | undefined>(() => this.currentBatters()[0]);
  batter2 = computed<Player | undefined>(() => this.currentBatters()[1]);

  striker = computed<Player | undefined>(() => this.service.striker);

 currentBowlerBalls = computed(() => this.service.currentOverBalls());
  target = computed(() => {
    if (this.service.innings() !== 2) return 0;
    if (!this.service.completedBattingTeam) return 0;
    return this.service.completedBattingTeam.scores + 1;
  });

  requiredRuns = computed(() => {
    if (this.service.innings() !== 2) return 0;
    const batting = this.currentBattingTeam();
    if (!batting) return 0;
    if (!this.service.completedBattingTeam) return 0;

    return Math.max(0, this.target() - batting.scores);
  });

  remainingBalls = computed(() => {
    if (this.service.innings() !== 2) return 0;
    const batting = this.currentBattingTeam();
    if (!batting) return 0;

    const overs = batting.overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs - fullOvers) * 10);
    const ballsBowled = fullOvers * 6 + ballsPart;

    return Math.max(0, 120 - ballsBowled);
  });

  showStartSecondInnings = computed(() => {
    if (this.service.innings() !== 1) return false;
    const batting = this.currentBattingTeam();
    if (!batting) return false;

    return batting.overs >= 20 || batting.wickets >= 10;
  });

  // Match can be manually completed from admin
  showCompleteMatch = computed(() => {
    if (this.service.innings() !== 2) return false;
    if (!this.service.completedBattingTeam) return false;

    const secondBatting = this.currentBattingTeam();
    if (!secondBatting) return false;

    const target = this.service.completedBattingTeam.scores + 1;

    return (
      secondBatting.scores >= target || secondBatting.overs >= 20 || secondBatting.wickets >= 10
    );
  });

  // True when match is finished / winner decided / DB status completed
  matchFinished = computed(() => {
    const live = this.service.live();
    if (!live) return false;

    if (live.status === 'COMPLETED') return true;

    if (this.service.innings() !== 2) return false;
    if (!this.service.completedBattingTeam) return false;

    const secondBatting = this.currentBattingTeam();
    if (!secondBatting) return false;

    const target = this.service.completedBattingTeam.scores + 1;

    return (
      secondBatting.scores >= target || secondBatting.overs >= 20 || secondBatting.wickets >= 10
    );
  });

  // Winner / result text for admin UI
  winnerText = computed(() => {
    const live = this.service.live();
    if (!live) return '';
    // if already completed and result stored in DB
    if (live.status === 'COMPLETED' && live.result) {
      return live.result;
    }

    if (this.service.innings() !== 2) return '';
    if (!this.service.completedBattingTeam) return '';

    const firstBatting = this.service.completedBattingTeam;
    const secondBatting = this.currentBattingTeam();

    if (!secondBatting) return '';

    const target = firstBatting.scores + 1;

    // chasing team wins
    if (secondBatting.scores >= target) {
      const wicketsLeft = 10 - secondBatting.wickets;
      return `${secondBatting.shortName} won by ${wicketsLeft} wickets`;
    }

    // innings ended and chasing team failed
    const inningsFinished = secondBatting.overs >= 20 || secondBatting.wickets >= 10;

    if (inningsFinished) {
      if (secondBatting.scores === firstBatting.scores) {
        return 'Match Tied';
      }

      if (secondBatting.scores < firstBatting.scores) {
        const margin = firstBatting.scores - secondBatting.scores;
        return `${firstBatting.shortName} won by ${margin} runs`;
      }
    }

    return '';
  });

  ngOnInit(): void {
    this.service.GetLiveMatches().subscribe({
      next: (res) => {
        if (res?.length) {
          this.service.loadMatchIntoService(res[0]);
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
    this.cd.detectChanges();
  }

 addBall(ball:string){

    if(this.matchFinished()) return;

    this.service.processBall(ball);

    if(this.service.legalBalls()===0){

        this.openBowlerDialog();

    }

}

  startSecondInnings() {
    this.openConfirmDialog(
      {
        title: 'Start Second Innings',
        message: 'Are you sure you want to change the innings?',
        confirmText: 'Change',
        cancelText: 'Cancel',
        type: 'primary'
      },
      () => {
        if (this.matchFinished()) return;
    this.service.startSecondInnings();
     this.showToast(
  'Second Innings Started...',
  'success'
);
      }
    );
    
  }

  saveLiveToDb() {
     this.openConfirmDialog(
    {
      title: 'Save Match Update',
      message: 'Do you want to save the current live match changes?',
      confirmText: 'Save',
      cancelText: 'Cancel',
      type: 'success'
    },
    () => {
      this.service.saveLiveToDb();
       this.showToast(
  'Scores Updated Successfully.',
  'success'
);
    }
  );
  }

  completeMatch() {
     this.openConfirmDialog(
    {
      title: 'Completed Status Update',
      message: 'Do you want to change the current live match status as completed?',
      confirmText: 'Complete',
      cancelText: 'Cancel',
      type: 'success'
    },
    () => {
      if (!this.showCompleteMatch()) return;

    this.service.completeMatch();
     this.showToast(
  'Completed saved successfully.',
  'success'
);
    }
  );
    
  }
   showToast(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastType = type;
  this.toastVisible = true;

  this.cd.detectChanges();

  clearTimeout(this.toastTimer);

  this.toastTimer = setTimeout(() => {
    this.toastVisible = false;
    this.cd.detectChanges();
  }, 1200);
}

closeToast() {
  this.toastVisible = false;
  clearTimeout(this.toastTimer);
}
availableBowlers = computed(() =>
  this.service
    .bowlers1()
    .map((b, index) => ({ ...b, index }))
    .filter(
      b =>
        b.index !== this.service.currentBowlerIndex() &&
        (b.overs ?? 0) < 4
    )
);
}
