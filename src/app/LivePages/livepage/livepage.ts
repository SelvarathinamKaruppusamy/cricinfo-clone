import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Scorecard } from '../scorecard/scorecard';
import { LiveModel, Player } from '../Models/models';
import { LiveService } from '../Services/live-service';
import { CommonModule } from '@angular/common';
import { Commentary } from '../commentary/commentary';
import { Statistics } from '../statistics/statistics';
@Component({
  selector: 'app-livepage',
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
export class Livepage implements OnInit {
  live!: LiveModel;
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  toss!: string;
  ball = this.service.ball;
  previousBowlerIndex = signal(-1);
  bowlerBallCount: Record<number, number> = {};
  currentBowlerBalls: string[] = [];
  striker!: Player;
  nonStriker!: Player;
  lastProcessedBallCount = 0;
  target = 0;
  requiredRuns = 0;
  remainingBalls = 0;
  wicket = 'W';
  wide = 'Wd';
  noBall = 'Nb';
  four = 4;
  six = 6;
  one = 1;
  three = 3;
  totalBalls = 120;
  constructor() {
    effect(() => {
      const balls = this.service.ball();

      if (balls.length === 0 || balls.length === this.lastProcessedBallCount) {
        return;
      }
      this.lastProcessedBallCount = balls?.length;
      const latestBall = balls[balls?.length - 1];
      this.processBall(latestBall);
      this.requiredRun();
    });
  }
  ngOnInit(): void {
    this.service?.tosswin.update((n) => Number(prompt(`Toss Time RCB vs CSK`)));
    this.service?.GetLiveMatches().subscribe((res) => {
      this.live = res[0];
      this.live.tossWinner=this.live.teams[this.service?.tosswin()].shortName
      this.service.live = this.live;
      this.service?.currentBattingTeam.set(this.service.tosswin());
      this.service?.currentBowlingTeam.set(this.service.tossloss());
      this.service?.players1.update((player) => [
        ...player,
        this.live.teams[this.service?.currentBattingTeam()].players[0],
      ]);

      this.service?.players1.update((player) => [
        ...player,
        this.live.teams[this.service?.currentBattingTeam()].players[1],
      ]);
      this.striker = this.service?.players1()[0];

      this.nonStriker = this.service?.players1()[1];
      this.live.teams[this.service?.currentBattingTeam()].players[0].status = 'Not Out';

      this.live.teams[this.service?.currentBattingTeam()].players[1].status = 'Not Out';
      this.service?.bowlers1.set(
        this.live.teams[this.service?.currentBowlingTeam()].players
          .filter((player) => player.role === 'Bowler' || player.role === 'All-Rounder')
          .map((p) => ({
            ...p,
            overs: 0.0,
            runsConceded: 0,
            wickets: 0,
            maidens: 0,
          })),
      );
      this.changedetector.detectChanges();
      this.toss = this.live.teams[this.service.currentBattingTeam()].shortName;
      // this.calculatescoreforplayer();
    });
    //

    console.log(this.service.completedBattingTeam);
  }
  currentBowler = computed(() => this.service?.bowlers1()[this.service?.currentBowlerIndex()]);
  currentbatters = computed(() =>
    this.service?.players1().filter((player) => player?.status === 'Not Out'),
  );
  currentBatter1 = computed(() => this.currentbatters()[0]);
  currentBatter2 = computed(() => this.currentbatters()[1]);

  legalBalls = 0;
  inningsBalls = 0;
  currentOverRuns = 0;
  bowler!:Player

  processBall(ball: string) {
    if (!this.striker || !this.nonStriker) {
      return;
    }

    this.bowler = this.service?.bowlers1()[this.service?.currentBowlerIndex()];
    this.currentBowlerBalls.push(ball);
    // ---------------- WIDE / NO BALL ----------------

    if (ball === this.wide || ball === this.noBall) {
     this.BallWideAndNoBall()
      return;
    }

    // ---------------- LEGAL BALL ----------------

    this.legalBalls++;
    this.inningsBalls++;

    this.bowlerBallCount[this.bowler.id] = (this.bowlerBallCount[this.bowler.id] || 0) + 1;

    const bowlerBalls = this.bowlerBallCount[this.bowler.id];

    this.bowler.overs = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;
    this.updateBowlerInLive(this.bowler);
    this.live.teams[this.service?.currentBattingTeam()].overs =
      Math.floor(this.inningsBalls / 6) + (this.inningsBalls % 6) / 10;

    // ---------------- WICKET ----------------

    if (ball === this.wicket) {
      this.striker.balls++;

      this.striker.strikeRate = Number(
        ((this.striker?.runs / this.striker?.balls) * 100).toFixed(2),
      );

      this.bowler.wickets++;
      this.updateBowlerInLive(this.bowler);
      const nextPlayer = this.handleWicket();

      if (nextPlayer) {
        this.striker = nextPlayer;
      }

      this.bowler.economy = Number((this.bowler.runsConceded / (bowlerBalls / 6)).toFixed(2));
      this.updateBowlerInLive(this.bowler);
    } else {
      const run = this.playerruns(ball);

      // Team Score

      this.live.teams[this.service?.currentBattingTeam()].scores += run;

      // Bowler Runs

      this.bowler.runsConceded += run;
      this.updateBowlerInLive(this.bowler);
      this.currentOverRuns += run;

      // Batter Stats

      this.striker.balls++;
      this.striker.runs += run;

      if (run === this.four) {
        this.striker.fours++;
      }

      if (run === this.six) {
        this.striker.sixes++;
      }

      this.striker.strikeRate = Number(((this.striker.runs / this.striker.balls) * 100).toFixed(2));

      // Rotate Strike

      if (run === this.one || run === this.three) {
        [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
      }

      this.bowler.economy = Number((this.bowler.runsConceded / (bowlerBalls / 6)).toFixed(2));
      this.updateBowlerInLive(this.bowler);
    }

    // ---------------- OVER COMPLETE ----------------

    if (this.legalBalls === this.six) {
      if (this.currentOverRuns === 0) {
        this.bowler.maidens++;
        this.updateBowlerInLive(this.bowler);
      }
      [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
      this.changeBowler();
      this.bowler = this.service?.bowlers1()[this.service?.currentBowlerIndex()];
      this.legalBalls = 0;
      this.currentBowlerBalls = [];
    }
  }
  BallWideAndNoBall(){
     this.bowler.runsConceded++;
      this.updateBowlerInLive(this.bowler);
      this.currentOverRuns++;

      this.live.teams[this.service?.currentBattingTeam()].scores++;

      this.live.teams[this.service?.currentBattingTeam()].extras++;

      const bowlerBalls = this.bowlerBallCount[this.bowler.id] || 0;

      if (bowlerBalls > 0) {
        this.bowler.economy = Number((this.bowler.runsConceded / (bowlerBalls / 6)).toFixed(2));
        this.updateBowlerInLive(this.bowler);
      }
  }
  playerruns(b: string): number {
    switch (b) {
      case '1':
        return 1;
      case '2':
        return 2;
      case '3':
        return 3;
      case '4':
        return 4;
      case '6':
        return 6;
      case '0':
        return 0;
      default:
        return -1;
    }
    return -1;
  }
  handleWicket() {
    const striker = this.striker;

    if (!striker) {
      return null;
    }

    striker.status = 'Out';

    this.live.teams[this.service?.currentBattingTeam()].wickets++;

    const nextIndex = this.service?.players1().length;

    const nextPlayer = this.live.teams[this.service?.currentBattingTeam()].players[nextIndex];

    if (nextPlayer) {
      nextPlayer.status = 'Not Out';

      this.service.players1.update((players) => [...players, nextPlayer]);

      return nextPlayer;
    }

    return null;
  }
  changeBowler() {
    const current = this.service?.currentBowlerIndex();

    const availableBowlers = this.service
      .bowlers1()
      .map((bowler, index) => ({
        bowler,
        index,
      }))
      .filter((item) => item.index !== current && item.bowler.overs < 4);

    if (!availableBowlers?.length) {
      return;
    }

    const random = Math.floor(Math.random() * availableBowlers?.length);

    this.service?.currentBowlerIndex.set(availableBowlers[random].index);
  }
  startSecondInnings() {
    this.service?.startSecondInnings();

    this.striker = this.service?.players1()[0];

    this.nonStriker = this.service?.players1()[1];

    this.currentBowlerBalls = [];
    this.bowlerBallCount = {};

    // RESET INNINGS COUNTERS
    this.legalBalls = 0;
    this.inningsBalls = 0;
    this.currentOverRuns = 0;
  }
  updateBowlerInLive = (bowler: any) => {
    const index = this.live.teams[this.service?.currentBowlingTeam()].players.findIndex(
      (p) => p.id === bowler.id,
    );
    if (index !== -1) {
      this.live.teams[this.service?.currentBowlingTeam()].players[index] = {
        ...this.live.teams[this.service?.currentBowlingTeam()].players[index],
        overs: bowler.overs,
        maidens: bowler.maidens,
        wickets: bowler.wickets,
        runsConceded: bowler.runsConceded,
        economy: bowler.economy,
      };
    }
  };
  requiredRun() {
    if (this.service.innings() === 2) {
      this.target = this.service?.completedBattingTeam.scores + 1;
      this.requiredRuns =
        this.target - this.service.live.teams[this.service?.currentBattingTeam()].scores;

      const ballsBowled =
        Math.floor(this.live.teams[this.service?.tossloss()].overs) * this.six +
        Math.round((this.live.teams[this.service?.tossloss()].overs % 1) * 10);

      this.remainingBalls = this.totalBalls - ballsBowled;
    }
  }
  addball(s: string) {
    this.service.addBall(s);
  }
}
