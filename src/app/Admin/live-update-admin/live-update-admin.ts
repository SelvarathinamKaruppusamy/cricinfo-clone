import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveService } from '../../LivePages/Services/live-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Player, Team } from '../../LivePages/Models/models';

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

  live = computed(() => this.service.live());

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
    this.service.players1().filter((p) => p.status === 'Not Out')
  );

  batter1 = computed<Player | undefined>(() => this.currentBatters()[0]);
  batter2 = computed<Player | undefined>(() => this.currentBatters()[1]);

  striker = computed<Player | undefined>(() => this.service.striker);

  currentBowlerBalls = computed(() => {
    const balls = this.service.ball();
    const result: string[] = [];
    let legalCount = 0;

    for (let i = balls.length - 1; i >= 0; i--) {
      result.unshift(balls[i]);

      if (balls[i] !== 'Wd' && balls[i] !== 'Nb') {
        legalCount++;
      }

      if (legalCount === 6) break;
    }

    return result;
  });

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
      secondBatting.scores >= target ||
      secondBatting.overs >= 20 ||
      secondBatting.wickets >= 10
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
      secondBatting.scores >= target ||
      secondBatting.overs >= 20 ||
      secondBatting.wickets >= 10
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
    const inningsFinished =
      secondBatting.overs >= 20 || secondBatting.wickets >= 10;

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

  addBall(ball: string) {
    // stop admin from adding balls after match finished
    if (this.matchFinished()) return;

    if (!ball?.trim()) return;
    this.service.processBall(ball.trim());
  }

  startSecondInnings() {
    if (this.matchFinished()) return;
    this.service.startSecondInnings();
  }

  saveLiveToDb() {
    this.service.saveLiveToDb();
  }

  completeMatch() {
    if (!this.showCompleteMatch()) return;
    this.service.completeMatch();
  }
}