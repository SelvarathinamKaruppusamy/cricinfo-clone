import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';

import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { LiveService } from '../Services/live-service';
import { LiveModel, Player, Team } from '../Models/models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements AfterViewInit {
  @ViewChild('inningsChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  service = inject(LiveService);

  live!: LiveModel;
  battingTeam!: Team;

  batter1!: Player;
  batter2!: Player;

  firstInningsRuns: number[] = [];
  secondInningsRuns: number[] = [];

  requiredRuns = 0;
  remainingOvers = 0;
  requiredRR = 0;
  target = 0;

  totalRuns = 0;
  totalBalls = 0;
  currentRR = 0;
  boundaries = 0;
  dotBalls = 0;
  extras = 0;

  overScores: number[] = [];
  wickets: any[] = [];
  cumulativeRuns: number[] = [];

  partnershipRuns = 0;
  partnershipBalls = 0;

  chart!: Chart;

  currentBowler = computed(() =>
    this.service.bowlers1()[this.service.currentBowlerIndex()]
  );

  // snapshots to prevent rerun every poll
  private lastBallSnapshot = '';
  private chartReady = false;

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
  constructor() {
    effect(() => {
      const live = this.service.live();
      if (!live) return;

      // always keep latest live reference
      this.live = live;
     this.battingTeam =
  live.teams.find(
    t => t.teamId === this.service.currentBattingTeam()
  )!;

      // current innings balls only
      const currentBalls = this.service.ball();
      const innings = this.service.innings();

      // include both innings arrays + innings in snapshot
      // so stats updates only when actual scoring state changes
      const snapshot = JSON.stringify({
        innings,
        first: this.service.firstInningsBalls(),
        second: this.service.secondInningsBalls(),
        batting: this.service.currentBattingTeam(),
        bowling: this.service.currentBowlingTeam(),
      });

      if (snapshot === this.lastBallSnapshot) {
        return;
      }

      this.lastBallSnapshot = snapshot;

      this.calculateStatistics();
      this.calculatePartnership();

      if (this.chartReady) {
        this.createChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.chartReady = true;
    this.loadMatch();
    this.calculateStatistics();
    this.calculatePartnership();
    this.createChart();
  }

  loadMatch() {
    const liveData = this.service.live();
    if (!liveData) return;

    this.live = liveData;
    this.battingTeam =
  this.live.teams.find(
    t => t.teamId === this.service.currentBattingTeam()
  )!;

    const currentBatters = this.service
      .players1()
      .filter((p) => p.status === 'Not Out');

    this.batter1 = currentBatters[0];
    this.batter2 = currentBatters[1];
  }
  private getRuns(ball: string): number {

  switch (ball) {

    case '1':
      return 1;

    case '2':
      return 2;

    case '3':
      return 3;

    case '4':
      return 4;

    case '5':
      return 5;

    case '6':
      return 6;

    case 'Wd':
    case 'Nb':
      return 1;

    default:
      return 0;
  }

}

  calculateStatistics() {
    const balls = this.service.ball();

    let currentOverScore = 0;
    let wicketCount = 0;

    this.totalRuns = 0;
    this.totalBalls = 0;
    this.boundaries = 0;
    this.dotBalls = 0;
    this.extras = 0;
    this.overScores = [];
    this.wickets = [];
    this.cumulativeRuns = [];

    balls.forEach((ball) => {
      const runs = this.getRuns(ball);

      this.totalRuns += runs;
      this.cumulativeRuns.push(this.totalRuns);
      currentOverScore += runs;

      if (ball === '4' || ball === '6') {
        this.boundaries++;
      }

      if (ball === '0') {
        this.dotBalls++;
      }

      if (ball === 'Wd' || ball === 'Nb') {
        this.extras++;
      } else {
        this.totalBalls++;
      }

    if (ball === 'W') {

  wicketCount++;

  const outPlayers = this.battingTeam.players.filter(
    p => p.status === 'Out'
  );

  const outPlayer = outPlayers[wicketCount - 1];

  this.wickets.push({
    score: `${wicketCount}-${this.totalRuns}`,
    player: outPlayer?.name ?? `Batter ${wicketCount}`,
    over: this.convertBallToOver(this.totalBalls),
  });

}

      if (this.totalBalls > 0 && this.totalBalls % 6 === 0) {
        this.overScores.push(currentOverScore);
        currentOverScore = 0;
      }
    });

    if (currentOverScore > 0) {
      this.overScores.push(currentOverScore);
    }

    this.currentRR =
      this.totalBalls > 0
        ? Number((this.totalRuns / (this.totalBalls / 6)).toFixed(2))
        : 0;

    // progression arrays for chart
    this.firstInningsRuns = this.calculateRunsProgress(
      this.service.firstInningsBalls()
    );
    this.secondInningsRuns = this.calculateRunsProgress(
      this.service.secondInningsBalls()
    );

    // second innings chase stats
    if (this.service.innings() === 2) {
      const liveData = this.service.live();
      if (!liveData) return;

      const secondInningsTeam =
  liveData.teams.find(
    t => t.teamId === this.service.currentBattingTeam()
  );

if (!secondInningsTeam) return;

    const firstBattingTeam =
  liveData.teams.find(
    t => t.teamId === this.service.currentBowlingTeam()
  );

if (!firstBattingTeam) return;
this.target = firstBattingTeam.runs + 1;

this.requiredRuns =
  Math.max(0, this.target - secondInningsTeam.runs);

      const ballsBowled =
        Math.floor(secondInningsTeam.overs) * 6 +
        Math.round((secondInningsTeam.overs % 1) * 10);

      const remainingBalls = 120 - ballsBowled;
      this.remainingOvers = remainingBalls / 6;

      this.requiredRR =
        this.remainingOvers > 0
          ? Number((this.requiredRuns / this.remainingOvers).toFixed(2))
          : 0;
    } else {
      this.target = 0;
      this.requiredRuns = 0;
      this.remainingOvers = 0;
      this.requiredRR = 0;
    }
  }

  calculateRunsProgress(balls: string[]): number[] {
    let total = 0;
    const runs: number[] = [];

    balls.forEach((ball) => {
      total += this.getRuns(ball);
      runs.push(total);
    });

    return runs;
  }

  calculatePartnership() {
    const currentBatters = this.service
      .players1()
      .filter((p) => p.status === 'Batting');

    if (currentBatters.length < 2) {
      this.partnershipRuns = 0;
      this.partnershipBalls = 0;
      return;
    }

    this.batter1 = currentBatters[0];
    this.batter2 = currentBatters[1];

    this.partnershipRuns = this.batter1.runs + this.batter2.runs;
    this.partnershipBalls = this.batter1.balls + this.batter2.balls;
  }

  convertBallToOver(ballNumber: number): string {
    const over = Math.floor(ballNumber / 6);
    const ball = ballNumber % 6;
    return `${over}.${ball}`;
  }

  createChart() {
    if (!this.chartCanvas || !this.live) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const maxBalls = Math.max(
      this.firstInningsRuns.length,
      this.secondInningsRuns.length
    );

    const labels = Array.from({ length: maxBalls }, (_, i) =>
      this.convertBallToOver(i + 1)
    );

    const tossWinner =
  this.live.teams.findIndex(
    t => t.shortName === this.live.tossWinner
  );

const firstBattingIndex =
  this.live.tossDecision === 'Bat'
    ? tossWinner
    : tossWinner === 0 ? 1 : 0;

const secondBattingIndex =
  firstBattingIndex === 0 ? 1 : 0;
    const datasets: any[] = [
      {
        label: this.live.teams[firstBattingIndex].shortName,
        data: this.firstInningsRuns,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.15)',
        borderWidth: 3,
        pointRadius: 2,
        tension: 0.35,
        fill: false,
      },
    ];

    if (this.secondInningsRuns.length > 0) {
      datasets.push({
        label: this.live.teams[secondBattingIndex].shortName,
        data: this.secondInningsRuns,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.15)',
        borderWidth: 3,
        pointRadius: 2,
        tension: 0.35,
        fill: false,
      });
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          title: {
            display: true,
            text: 'Innings Progression',
            color: '#ffffff',
            font: {
              size: 20,
              weight: 'bold',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#38bdf8',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
            title: {
              display: true,
              text: 'Balls',
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
          y: {
            ticks: {
              color: '#4ade80',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
            title: {
              display: true,
              text: 'Runs',
              color: '#ffffff',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
          },
        },
      },
    });
  }
}