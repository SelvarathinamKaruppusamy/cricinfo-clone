import {
  AfterViewInit,
  ChangeDetectorRef,
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
  imports: [CommonModule, MatCardModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements AfterViewInit {
  @ViewChild('inningsChart')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  service = inject(LiveService);
  cd = inject(ChangeDetectorRef);
  firstInningsRuns: number[] = [];
  secondInningsRuns: number[] = [];
  requiredRuns = 0;
  remainingOvers = 0;
  requiredRR = 0;
  target = 0;
  constructor() {
    effect(() => {
      this.service.ball();

      if (this.live) {
        this.calculateStatistics();

        this.calculatePartnership();

        this.createChart();
      }
      console.log(this.service.live);
    });
  }

  battingTeam!: Team;

  live!: LiveModel;

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

  batter1!: Player;
  batter2!: Player;

  chart!: Chart;

  ngAfterViewInit(): void {
    this.loadMatch();

    this.calculateStatistics();
  }

  loadMatch() {
    this.service.GetLiveMatches().subscribe({
      next: (res) => {
        this.live = res[0];
        this.battingTeam = this.live.teams[this.service.tosswin()];
        const currentBatters = this.service.players1().filter((p) => p.status === 'Not Out');
        this.batter1 = currentBatters[0];
        this.batter2 = currentBatters[1];
        this.calculatePartnership();
        this.createChart();
      },
      error: (err) => {
        console.error(err);
      },
    });
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
      const runs = this.service.calculateScore(ball);
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
        const outPlayer = this.service.completedBatters()[wicketCount - 1];
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
      this.totalBalls > 0 ? Number((this.totalRuns / (this.totalBalls / 6)).toFixed(2)) : 0;
    this.firstInningsRuns = this.calculateRunsProgress(this.service.firstInningsBalls());

    this.secondInningsRuns = this.calculateRunsProgress(this.service.secondInningsBalls());
    if (this.service.innings() === 2) {
      const firstInningsTeam = this.live.teams[this.service.tosswin()];

      const secondInningsTeam = this.live.teams[this.service.tossloss()];

      this.target = this.service.completedBattingTeam.scores + 1;
      this.requiredRuns =
        this.target - this.service.live.teams[this.service.currentBattingTeam()].scores;

      const ballsBowled =
        Math.floor(secondInningsTeam.overs) * 6 + Math.round((secondInningsTeam.overs % 1) * 10);

      const remainingBalls = 120 - ballsBowled;

      this.remainingOvers = remainingBalls / 6;

      this.requiredRR =
        this.remainingOvers > 0 ? Number((this.requiredRuns / this.remainingOvers).toFixed(2)) : 0;
    }
  }
  convertBallToOver(ballNumber: number): string {
    const over = Math.floor(ballNumber / 6);
    const ball = ballNumber % 6;
    return `${over}.${ball}`;
  }
  calculateRunsProgress(balls: string[]): number[] {
    let total = 0;

    const runs: number[] = [];

    balls.forEach((ball) => {
      total += this.service.calculateScore(ball);

      runs.push(total);
    });

    return runs;
  }
  calculatePartnership() {
    const currentBatters = this.service.players1().filter((p) => p.status === 'Not Out');

    if (currentBatters.length < 2) {
      return;
    }

    this.batter1 = currentBatters[0];
    this.batter2 = currentBatters[1];

    this.partnershipRuns = this.batter1.runs + this.batter2.runs;
    this.partnershipBalls = this.batter1.balls + this.batter2.balls;
  }

  currentBowler = computed(() => this.service.bowlers1()[this.service.currentBowlerIndex()]);
  createChart() {
    if (!this.chartCanvas) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
    const maxBalls = Math.max(this.firstInningsRuns.length, this.secondInningsRuns.length);

    const labels = Array.from({ length: maxBalls }, (_, i) => this.convertBallToOver(i + 1));
    const datasets: any[] = [
      {
        label: this.live.teams[this.service.tosswin()].shortName,

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
        label: this.live.teams[this.service.tossloss()].shortName,

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
