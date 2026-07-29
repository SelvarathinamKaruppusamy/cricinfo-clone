import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveService } from '../Services/live-service';
import { LiveModel, commentary } from '../Models/models';

@Component({
  selector: 'app-commentary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commentary.html',
  styleUrl: './commentary.css',
})
export class Commentary implements OnInit {

  service = inject(LiveService);

  live!: LiveModel;

  commentary = commentary;

  overscores: number[] = [];
  cumulativeScores: number[] = [];

  overscore = 0;
  ballcount = 0;

  over: { ball: string; text: string }[] = [];
  commentaryLog: { ball: string; text: string }[][] = [];

  battingTeam = computed(() =>
    this.service.live()?.teams[this.service.currentBattingTeam()]
  );

  private lastBallSnapshot = '';

  constructor() {

    effect(() => {

      const balls = this.service.ball();

      const snapshot = balls.join('|');

      if (snapshot === this.lastBallSnapshot) {
        return;
      }

      this.lastBallSnapshot = snapshot;

      this.buildCommentary(balls);

    });

  }

  ngOnInit(): void {

    const live = this.service.live();

    if (live) {
      this.live = live;
    }

  }

  private getRuns(ball: string): number {

    switch (ball) {

      case '0':
        return 0;

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

      case 'W':
      default:
        return 0;

    }

  }

  buildCommentary(balls: string[]) {

    this.commentaryLog = [];
    this.overscores = [];
    this.cumulativeScores = [];

    this.over = [];

    this.ballcount = 0;
    this.overscore = 0;

    let totalScore = 0;

    balls.forEach((ball, index) => {

      const run = this.getRuns(ball);

      this.overscore += run;
      totalScore += run;

      const comments =
        this.commentary[ball as keyof typeof commentary] ??
        [`Ball result: ${ball}`];

      const text =
        comments[index % comments.length];

      this.over.unshift({
        ball,
        text
      });

      if (ball !== 'Wd' && ball !== 'Nb') {

        this.ballcount++;

      }

      if (this.ballcount === 6) {

        this.commentaryLog.unshift([...this.over]);

        this.overscores.unshift(this.overscore);

        this.cumulativeScores.unshift(totalScore);

        this.over = [];

        this.ballcount = 0;

        this.overscore = 0;

      }

    });

    if (this.over.length) {

      this.commentaryLog.unshift([...this.over]);

      this.overscores.unshift(this.overscore);

      this.cumulativeScores.unshift(totalScore);

    }

  }

}