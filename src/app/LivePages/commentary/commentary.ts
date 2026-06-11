import { ChangeDetectorRef, Component, computed, effect, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { LiveService } from '../Services/live-service';

import { LiveModel, commentary } from '../Models/models';

@Component({
  selector: 'app-commentary',
  imports: [CommonModule],
  templateUrl: './commentary.html',
  styleUrl: './commentary.css',
})
export class Commentary implements OnInit {
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  live!: LiveModel;
  commentary = commentary;
  overscores: number[] = [];
  cumulativeScores: number[] = [];
  overscore = 0;
  ballcount = 0;
  over: { ball: string; text: string }[] = [];
  commentaryLog: { ball: string; text: string }[][] = [];
  battingTeam = computed(() => this.service.live?.teams[this.service.currentBattingTeam()]);
  constructor() {
    effect(() => {
      this.service.ball();
      this.buildCommentary();
    });
  }
  ngOnInit(): void {
    this.live = this.service.live;
  }

  buildCommentary() {
    this.commentaryLog = [];
    this.overscores = [];
    this.cumulativeScores = [];
    this.over = [];
    this.ballcount = 0;
    this.overscore = 0;
    this.service.ball().forEach((ball) => {
      this.overscore += this.service.calculateScore(ball);
      const comments = this.commentary[ball as keyof typeof commentary];
      const text = comments[Math.floor(Math.random() * comments.length)];
      this.over.push({ ball, text });
      if (ball !== 'Wd' && ball !== 'Nb') {
        this.ballcount++;
      }
      if (this.ballcount === 6) {
        this.commentaryLog.unshift([...this.over]);
        this.overscores.push(this.overscore);
        const previous =
          this.cumulativeScores.length > 0
            ? this.cumulativeScores[this.cumulativeScores.length - 1]
            : 0;
        this.cumulativeScores.push(previous + this.overscore);
        this.over = [];
        this.ballcount = 0;
        this.overscore = 0;
      }
    });
    if (this.over.length > 0) {
      this.commentaryLog.push([...this.over]);
      this.overscores.push(this.overscore);
      const previous =
        this.cumulativeScores.length > 0
          ? this.cumulativeScores[this.cumulativeScores.length - 1]
          : 0;
      this.cumulativeScores.push(previous + this.overscore);
    }
  }

  //   resetCommentary() {

  //   this.commentaryLog = [];

  //   this.overscores = [];

  //   this.cumulativeScores = [];

  //   this.over = [];

  //   this.ballcount = 0;

  //   this.overscore = 0;

  // }
}
