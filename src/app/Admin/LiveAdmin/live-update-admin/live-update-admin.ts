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

  dialogRef.afterClosed().subscribe(playerId => {



  if (playerId == null) return;

  this.service.changeBowler(playerId);

});

}
  currentBatting = computed(() => {
  const live = this.service.live();
  if (!live) return null;

  return live.teams.find(
    t => t.teamId === this.service.currentBattingTeam()
  ) ?? null;
});

currentBowling = computed(() => {
  const live = this.service.live();
  if (!live) return null;

  return live.teams.find(
    t => t.teamId === this.service.currentBowlingTeam()
  ) ?? null;
});

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
    this.service.players1().filter((p) => p.status === 'Batting'),
  );

  batter1 = computed<Player | undefined>(() => this.currentBatters()[0]);
  batter2 = computed<Player | undefined>(() => this.currentBatters()[1]);

  striker = computed<Player | undefined>(() => this.service.striker);

 currentBowlerBalls = computed(() => {

    return this.service.currentOverBalls();

});
 target = computed(() => {
  const bowling = this.currentBowling();

  if (!bowling) return 0;

  return this.service.innings() === 2
    ? (bowling.runs ?? 0) + 1
    : 0;
});

 requiredRuns = computed(() => {
  const batting = this.currentBatting();

  if (!batting) return 0;

  return Math.max(
    0,
    this.target() - (batting.runs ?? 0)
  );
});

  remainingBalls = computed(() => {
    if (this.service.innings() !== 2) return 0;
    const batting = this.currentBatting();
    if (!batting) return 0;

    const overs = batting.overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs - fullOvers) * 10);
    const ballsBowled = fullOvers * 6 + ballsPart;

    return Math.max(0, 120 - ballsBowled);
  });

 showStartSecondInnings = computed(() => false);

  // Match can be manually completed from admin
  showCompleteMatch = computed(() => {

    return false;

});

  // True when match is finished / winner decided / DB status completed
 matchFinished = computed(() => {

  const live = this.service.live();

  return live?.status =="COMPLETED";

});

winnerText = computed(() => {

  return this.service.live()?.result ?? '';

});

 ngOnInit(): void {

  this.service.GetLiveMatch().subscribe({

    next: (match) => {

      this.service.loadMatchIntoService(match);
      this.cd.detectChanges();

    },

    error: (err: any) => console.error(err)

  });

}

addBall(ball: string) {

  if (this.matchFinished()) return;

  this.service.processBall(ball).subscribe({

    next: () => {
  this.reloadMatch()
      if (this.service.currentOverBalls().length === 0) {

        

        this.openBowlerDialog();

      }

      this.cd.detectChanges();

    },

    error: err => console.error(err)

  });

}
reloadMatch() {

  this.service.GetLiveMatch().subscribe({

    next: (match) => {
console.log("Status:", match.status);

      this.service.loadMatchIntoService(match);

      this.cd.detectChanges();

    },

    error: (err: any) => console.error(err)

  });

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
completeMatch() {

  this.router.navigate([
    '/navbarAdmin/adminLive/completed'
  ]);

}
saveLiveToDb() {

  this.showToast(
    'All changes are already saved.',
    'success'
  );

}
startSecondInnings() {

  const matchNo = this.live()?.matchNo;

  if (!matchNo) return;

  this.service.StartSecondInnings(matchNo).subscribe({

    next: () => {

      this.reloadMatch();

      this.showToast(
        'Second Innings Started',
        'success'
      );

    },

    error: err => console.error(err)

  });

}
}
