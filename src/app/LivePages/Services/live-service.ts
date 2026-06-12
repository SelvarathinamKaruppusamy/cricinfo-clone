import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LiveModel, Player, Team } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  http = inject(HttpClient);
  live!: LiveModel;
  currentBowlerIndex = signal(0);

  // Current innings data
  players1 = signal<Player[]>([]);
  bowlers1 = signal<Player[]>([]);
  currentBattingTeam = signal(1);
  currentBowlingTeam = signal(0);
  // Completed innings data

  completedBatters = signal<Player[]>([]);
  completedBowlers = signal<Player[]>([]);
  completedBattingTeam!: Team;
  completedBowlingTeam!: Team;

  innings = signal(1);

  firstInningsBalls = signal<string[]>([]);
  secondInningsBalls = signal<string[]>([]);

  // Innings
  // currentInnings = signal(1);
  // Toss
  tosswin = signal(1);
  tossloss = computed(() => (this.tosswin() === 1 ? 0 : 1));
  // First innings summary
  firstInningsScore = signal({
    runs: 0,
    wickets: 0,
    overs: 0,
  });
  // Ball colors
  ballColors: Record<string, string> = {
    '3': 'bg-violet-600 border-violet-300',
    '4': 'bg-indigo-600 border-indigo-300',
    '6': 'bg-emerald-600 border-emerald-300',
    W: 'bg-rose-600 border-rose-300',
    Nb: 'bg-amber-500 border-amber-200',
    Wd: 'bg-zinc-800 border-zinc-400',
  };

  // balls
  ball = computed(() =>
    this.innings() === 1 ? this.firstInningsBalls() : this.secondInningsBalls(),
  );
  GetLiveMatches(): Observable<LiveModel[]> {
    return this.http.get<LiveModel[]>('http://localhost:3000/matches').pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      }),
    );
  }
  UpdateMatch(matchId: any, Match: Partial<LiveModel>): Observable<LiveModel> {
    return this.http.put<LiveModel>(`http://localhost:3000/matches/${matchId}`, Match);
  }
  // run conventor
  calculateScore(score: string): number {
    switch (score) {
      case '0':
      case 'W':
        return 0;
      case '1':
      case 'Wd':
      case 'Nb':
        return 1;
      case '2':
        return 2;
      case '3':
        return 3;
      case '4':
        return 4;
      case '6':
        return 6;
      default:
        return 0;
    }
  }
  // End of firsst innings
  completeFirstInnings() {
    this.bowlers1().forEach((bowler) => {
      const index = this.live.teams[this.currentBowlingTeam()].players.findIndex(
        (p) => p.id === bowler.id,
      );

      if (index !== -1) {
        this.live.teams[this.currentBowlingTeam()].players[index] = {
          ...this.live.teams[this.currentBowlingTeam()].players[index],

          overs: bowler.overs,
          maidens: bowler.maidens,
          wickets: bowler.wickets,
          runsConceded: bowler.runsConceded,
          economy: bowler.economy,
        };
      }
    });

    this.completedBatters.set(structuredClone(this.players1()));

    this.completedBowlers.set(structuredClone(this.bowlers1()));

    this.completedBattingTeam = structuredClone(this.live.teams[this.currentBattingTeam()]);

    this.completedBowlingTeam = structuredClone(this.live.teams[this.currentBowlingTeam()]);

    this.players1.set([]);
    this.bowlers1.set([]);
  }
  startSecondInnings() {
    this.completeFirstInnings();
    this.innings.set(2);
    console.log(this.completedBattingTeam);
    console.log(this.completedBowlingTeam);
    console.log(this.completedBatters());
    console.log(this.completedBowlers());
    console.log(this.players1());

    this.currentBattingTeam.set(this.tossloss());

    this.currentBowlingTeam.set(this.tosswin());

    const battingTeam = this.live.teams[this.currentBattingTeam()];

    const bowlingTeam = this.live.teams[this.currentBowlingTeam()];

    battingTeam.scores = 0;
    battingTeam.wickets = 0;
    battingTeam.overs = 0;
    battingTeam.extras = 0;

    battingTeam.players.forEach((player) => {
      player.runs = 0;
      player.balls = 0;
      player.fours = 0;
      player.sixes = 0;
      player.strikeRate = 0;
      player.status = '';
    });

    battingTeam.players[0].status = 'Not Out';

    battingTeam.players[1].status = 'Not Out';

    this.players1.set([battingTeam.players[0], battingTeam.players[1]]);

    this.bowlers1.set(
      bowlingTeam.players
        .filter((p) => p.role === 'Bowler' || p.role === 'All-Rounder')
        .map((p) => ({
          ...p,
          overs: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          economy: 0,
        })),
    );
  }
  addBall(ball: string) {
    if (this.innings() === 1) {
      this.firstInningsBalls.update((balls) => [...balls, ball]);
    } else {
      this.secondInningsBalls.update((balls) => [...balls, ball]);
    }
  }
}
