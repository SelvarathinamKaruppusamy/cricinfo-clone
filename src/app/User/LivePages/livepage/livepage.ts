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
    this.service.players1().filter((player) => player.status =='Batting')
  );
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

  currentBatter1 = computed(() => this.currentbatters()[0]);
  currentBatter2 = computed(() => this.currentbatters()[1]);

  striker = computed(() => this.service.striker);
  nonStriker = computed(() => this.service.nonStriker);
  currentBowler = computed(() => this.service.currentBowler);

  tossDecision = computed(() => this.live()?.tossDecision ?? '');

  toss = computed(() => this.service.live()?.tossWinner ?? '');

  // ✅ USE CURRENT OVER BALLS SIGNAL DIRECTLY
currentBowlerBalls = computed(() => {

  const inningsBalls = this.service.ball();

  if (!inningsBalls.length) return [];

  const currentOver: string[] = [];

  let legalBalls = 0;

  // Traverse backwards
  for (let i = inningsBalls.length - 1; i >= 0; i--) {

    currentOver.unshift(inningsBalls[i]);

    // Only legal balls count
    if (inningsBalls[i] !== 'WD' &&
        inningsBalls[i] !== 'NB') {

      legalBalls++;
      // Stop after 6 legal balls
      if (legalBalls === 6)
        break;
    }
  }

  // If current over is incomplete,
  // remove previous over balls
  const totalLegalBalls =
    inningsBalls.filter(
      x => x !== 'WD' && x !== 'NB'
    ).length;

  const ballsInCurrentOver = totalLegalBalls % 6;

  if (ballsInCurrentOver === 0)
    return currentOver;

  let count = 0;
  const result: string[] = [];

  for (let i = currentOver.length - 1; i >= 0; i--) {

    result.unshift(currentOver[i]);

    if (currentOver[i] !== 'WD' &&
        currentOver[i] !== 'NB') {

      count++;

      if (count === ballsInCurrentOver)
        break;
    }
  }

  return result;

});

//  currentBowlerBalls = computed(() => {

//     return this.service.currentOverBalls();

// });
target = computed(() => {

  const live = this.live();

  if (!live) return 0;

  if (this.service.innings() !== 2) return 0;

  

  return (this.currentBowling()?.runs ?? 0) + 1;

});
 requiredRuns = computed(() => {

  const live = this.live();

  if (!live) return 0;

  if (this.service.innings() !== 2) return 0;
  return Math.max(
    0,
    this.target() - (this.currentBatting()?.runs ?? 0)
  );

});

  remainingBalls = computed(() => {
    const live = this.service.live();
    if (!live) return 0;
    if (this.service.innings() !== 2) return 0;

    const overs = this.currentBatting()?.overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs - fullOvers) * 10);
    const ballsBowled = fullOvers * 6 + ballsPart;

    return Math.max(0, 120 - ballsBowled);
  });

 matchWon = computed(() => {

  const live = this.live();

  if (!live) return false;

  if (this.service.innings() !== 2) return false;
  return (this.currentBatting()?.runs ?? 0) >= this.target();

});

  ngOnInit(): void {
    this.startLivePolling();
  }

  startLivePolling() {
  this.pollSub = interval(1000)
    .pipe(
      startWith(0),
      switchMap(() => this.service.GetLiveMatch())
    )
    .subscribe({
      next: (match) => {

  if (!match) return;
  const latestMatch = structuredClone(match);
console.log("From API First:", latestMatch.firstInningsBalls);

  this.service.loadMatchIntoService(latestMatch);
 console.log("Balls:", this.service.ball());
  console.log("Current Over:", this.currentBowlerBalls());
       if (
  !this.winnerAnimationPlayed &&
  this.service.innings() === 2 &&
  (
    this.matchWon() ||
    this.remainingBalls() === 0 ||
    (this.currentBatting()?.wickets ?? 0) >= 10
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
battingTeam = computed(() => {
  const live = this.live();
  if (!live) return null;

  return live.teams.find(
    t => t.teamId === this.service.currentBattingTeam()
  ) ?? null;
});

bowlingTeam = computed(() => {
  const live = this.live();
  if (!live) return null;

  return live.teams.find(
    t => t.teamId === this.service.currentBowlingTeam()
  ) ?? null;
});
  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }
}