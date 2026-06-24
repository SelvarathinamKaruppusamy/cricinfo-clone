import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { LiveService } from '../../../LivePages/Services/live-service';
import { LiveModel, Team } from '../../../LivePages/Models/models';

@Component({
  selector: 'app-toss-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './toss-panel.html',
  styleUrl: './toss-panel.css',
})
export class TossPanel implements OnInit {
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  live!: LiveModel;
  teams: Team[] = [];

  selectedTossWinner: 0 | 1 | null = null;
  selectedCall: 'Head' | 'Tail' | null = null;
  selectedDecision: 'Bat' | 'Bowl' | null = null;

  isSaving = false;

  ngOnInit(): void {
    this.service.GetLiveMatches().subscribe({
      next: (res) => {
        if (!res?.length) return;

        this.live = structuredClone(res[0]);
        this.teams = this.live?.teams ?? [];

        // load into service
        this.service.loadMatchIntoService(this.live);

        this.changedetector.detectChanges();
        console.log('Toss panel loaded live match:', this.service.live());
      },
      error: (err) => console.error(err),
    });
  }

  get tossSummary(): string {
    if (
      this.selectedTossWinner === null ||
      !this.selectedCall ||
      !this.selectedDecision
    ) {
      return '';
    }

    const winner = this.live?.teams[this.selectedTossWinner]?.shortName ?? '';
    const decisionText =
      this.selectedDecision === 'Bat' ? 'bat first' : 'bowl first';

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
    return (
      this.selectedTossWinner !== null &&
      !!this.selectedCall &&
      !!this.selectedDecision &&
      !this.isSaving
    );
  }

  saveToss() {
    if (!this.canSaveToss() || !this.live) return;

    this.isSaving = true;

    const tossWinnerIndex = this.selectedTossWinner!;
    const tossLoserIndex = tossWinnerIndex === 0 ? 1 : 0;

    // set service toss + batting/bowling state
    this.service.tossWinner.set(tossWinnerIndex);
    this.service.tossCall.set(this.selectedCall!);
    this.service.tossDecision.set(this.selectedDecision!);
    this.service.tosswin.set(tossWinnerIndex);

    if (this.selectedDecision === 'Bat') {
      this.service.currentBattingTeam.set(tossWinnerIndex);
      this.service.currentBowlingTeam.set(tossLoserIndex);
    } else {
      this.service.currentBattingTeam.set(tossLoserIndex);
      this.service.currentBowlingTeam.set(tossWinnerIndex);
    }

    // update service.live with toss + innings runtime info
    this.service.live.update((live) => {
      if (!live) return live;

      return {
        ...live,
        tossWinner: live.teams[tossWinnerIndex]?.shortName ?? null,
        tossDecision: this.selectedDecision!,
        innings: 1,
        currentBattingTeamIndex: this.service.currentBattingTeam(),
        currentBowlingTeamIndex: this.service.currentBowlingTeam(),
      };
    });

    // initialize players/bowlers for innings 1 before saving
    this.service.initCurrentInningsPlayers();
    this.service.syncCurrentPlayersToLive();

    const updatedLive = this.service.live();
    if (!updatedLive) {
      this.isSaving = false;
      return;
    }

    this.service.UpdateMatch(updatedLive.id, updatedLive).subscribe({
      next: (updated) => {
        this.service.loadMatchIntoService(updated);

        // confirmation message
        this.snackBar.open('Toss saved successfully. Redirecting to Live Update...', 'OK', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        // auto redirect after short delay
        setTimeout(() => {
          this.router.navigate(['/admin/liveupdate']);
        }, 1200);

        this.isSaving = false;
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;

        this.snackBar.open('Failed to save toss', 'Close', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}