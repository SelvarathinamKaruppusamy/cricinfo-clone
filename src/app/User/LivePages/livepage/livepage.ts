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
import { LiveAnimation } from '../live-animation/live-animation';
import { Animation } from '../Services/animation';

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
    LiveAnimation
  ],
  templateUrl: './livepage.html',
  styleUrl: './livepage.css',
})
export class Livepage implements OnInit, OnDestroy {
  service = inject(LiveService);
  cd = inject(ChangeDetectorRef);
animation = inject(Animation);
  pollSub?: Subscription;
private previousBallCount = 0;
private previousInnings = 1;
  live = computed(() => this.service.live());
  private winnerAnimationPlayed = false;

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
  const legalBallsInCurrentOver = Math.round((overs % 1) * 10);
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
        this.service.loadMatchIntoService(latestMatch);

       if (
  !this.winnerAnimationPlayed &&
  this.service.innings() === 2 &&
  (
    this.matchWon() ||
    this.remainingBalls() === 0 ||
    latestMatch.teams[this.service.currentBattingTeam()].wickets >= 10
  )
) {
  this.winnerAnimationPlayed = true;
  this.animation.showWinner();
}
        const currentInnings = this.service.innings();
        if (currentInnings !== this.previousInnings) {
          this.previousInnings = currentInnings;
          this.previousBallCount = 0;
        }
        const balls = this.service.ball();
        if (balls.length > this.previousBallCount) {
          this.previousBallCount = balls.length;
          const latestBall = balls.at(-1)!;
          this.animation.show(latestBall);
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
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