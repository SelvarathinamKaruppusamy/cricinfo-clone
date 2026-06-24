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

  currentBowlerBalls = computed(() => {
    const balls = this.service.ball();
    const overBalls: string[] = [];
    let legalCount = 0;

    for (let i = balls.length - 1; i >= 0; i--) {
      overBalls.unshift(balls[i]);

      if (balls[i] !== 'Wd' && balls[i] !== 'Nb') {
        legalCount++;
      }

      if (legalCount === 6) break;
    }

    return overBalls;
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

          // IMPORTANT:
          // use loadMatchIntoService instead of manually setting live + reset
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