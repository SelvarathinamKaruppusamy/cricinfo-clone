import {
  ChangeDetectorRef,
  Component,
 computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { interval, Subscription, switchMap, startWith } from 'rxjs';

import { Scorecard } from '../scorecard/scorecard';
import { Commentary } from '../commentary/commentary';
import { Statistics } from '../statistics/statistics';

import { LiveService } from '../Services/live-service';
import { Player } from '../Models/models';

@Component({
  selector: 'app-livepage',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    Scorecard,
    CommonModule,
    Commentary,
    Statistics,
  ],
  templateUrl: './livepage.html',
  styleUrl: './livepage.css',
})
export class Livepage implements OnInit, OnDestroy {
  service = inject(LiveService);
  cd = inject(ChangeDetectorRef);

  pollSub?: Subscription;

  live = computed(() => this.service.live());

  currentbatters = computed<Player[]>(() =>
    this.service.players1().filter((player) => player.status === 'Not Out')
  );

  currentBatter1 = computed(() => this.currentbatters()[0]);
  currentBatter2 = computed(() => this.currentbatters()[1]);

  striker = computed(() => this.service.striker);
  nonStriker = computed(() => this.service.nonStriker);
  currentBowler = computed(() => this.service.currentBowler);

  tossDecision = computed(
    () => this.service.tossDecision() ?? this.live()?.tossDecision ?? ''
  );

  toss = computed(() => this.service.live()?.tossWinner ?? '');

  // ✅ USE CURRENT OVER BALLS SIGNAL DIRECTLY
 currentBowlerBalls = computed(() => {
  const live = this.service.live();
  if (!live) return [];

  const battingTeam = live.teams[this.service.currentBattingTeam()];
  if (!battingTeam) return [];

  const overs = battingTeam.overs ?? 0;

  // current over legal balls count from overs
  // 2.3 => 3 balls in current over
  // 5.0 => 0 balls in current over
  const legalBallsInCurrentOver = Math.round((overs % 1) * 10);

  // if over just completed, show empty
  if (legalBallsInCurrentOver === 0) return [];

  const inningsBalls = this.service.ball();
  const result: string[] = [];

  let legalCount = 0;

  for (let i = inningsBalls.length - 1; i >= 0; i--) {
    result.unshift(inningsBalls[i]);

    if (inningsBalls[i] !== 'Wd' && inningsBalls[i] !== 'Nb') {
      legalCount++;
    }

    if (legalCount === legalBallsInCurrentOver) {
      break;
    }
  }

  return result;
});

  target = computed(() => {
    if (this.service.innings() !== 2) return 0;
    if (!this.service.completedBattingTeam) return 0;

    return this.service.completedBattingTeam.scores + 1;
  });

  requiredRuns = computed(() => {
    const live = this.service.live();
    if (!live) return 0;
    if (this.service.innings() !== 2) return 0;
    if (!this.service.completedBattingTeam) return 0;

    const currentScore = live.teams[this.service.currentBattingTeam()].scores;
    return Math.max(0, this.target() - currentScore);
  });

  remainingBalls = computed(() => {
    const live = this.service.live();
    if (!live) return 0;
    if (this.service.innings() !== 2) return 0;

    const overs = live.teams[this.service.currentBattingTeam()].overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs - fullOvers) * 10);
    const ballsBowled = fullOvers * 6 + ballsPart;

    return Math.max(0, 120 - ballsBowled);
  });

  matchWon = computed(() => {
    if (this.service.innings() !== 2) return false;
    if (!this.service.completedBattingTeam) return false;

    const live = this.service.live();
    if (!live) return false;

    const chasingTeam = live.teams[this.service.currentBattingTeam()];
    return chasingTeam.scores >= this.target();
  });

  ngOnInit(): void {
    this.startLivePolling();
  }

  startLivePolling() {
    this.pollSub = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.service.GetLiveMatches())
      )
      .subscribe({
        next: (res) => {
          if (!res?.length) return;

          const latestMatch = structuredClone(res[0]);

          // reload live + rebuild runtime state from DB
          this.service.loadMatchIntoService(latestMatch);

          this.cd.detectChanges();
        },
        error: (err) => console.error('Polling error:', err),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  startSecondInnings() {
    this.service.startSecondInnings();
  }

  addball(ball: string) {
    if (!ball?.trim()) return;
    this.service.processBall(ball.trim());
  }
}