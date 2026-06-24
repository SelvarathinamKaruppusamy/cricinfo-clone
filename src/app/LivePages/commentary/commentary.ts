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

  // store last processed ball sequence
  private lastBallSnapshot = '';

  constructor() {
    effect(() => {
      const balls = this.service.ball();

      // convert to stable snapshot
      const snapshot = balls.join('|');

      // if same ball sequence, do nothing
      if (snapshot === this.lastBallSnapshot) {
        return;
      }

      this.lastBallSnapshot = snapshot;
      this.buildCommentary(balls);
    });
  }

  ngOnInit(): void {
    const liveData = this.service.live();
    if (!liveData) return;
    this.live = liveData;
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
      const run = this.service.calculateScore(ball);
      this.overscore += run;
      totalScore += run;

      const comments = this.commentary[ball as keyof typeof commentary] ?? [
        `Ball result: ${ball}`,
      ];

      // stable commentary selection
      const text = comments[index % comments.length];

      this.over.unshift({ ball, text });

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

    if (this.over.length > 0) {
      this.commentaryLog.unshift([...this.over]);
      this.overscores.unshift(this.overscore);
      this.cumulativeScores.unshift(totalScore);
    }
  }
}