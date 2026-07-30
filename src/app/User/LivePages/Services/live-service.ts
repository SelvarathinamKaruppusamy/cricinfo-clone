import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LiveModel, Player, Team } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  MatchNo = signal(0);
  private readonly apiUrl = 'https://localhost:7144/api/live';
  GetLiveMatch(): Observable<LiveModel> {
    return this.http.get<LiveModel>(`${this.apiUrl}`);
  }
  UpdateToss(matchNo: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/match/${matchNo}`, body);
  }

  StartMatch(matchNo: number) {
    return this.http.post(
      `${this.apiUrl}/start-match/${matchNo}`,
      {},
      {
        responseType: 'text',
      },
    );
  }

  ProcessBall(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ball`, body);
  }

  ChangeBowler(body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-bowler`, body);
  }

  UpdatePlayerOfMatch(matchNo: number, body: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${matchNo}/player-of-the-match`, body);
  }
  StartSecondInnings(matchNo: number) {
    return this.http.post(`${this.apiUrl}/start-second-innings/${matchNo}`, {});
  }
  CompleteMatch(body: any) {
    return this.http.put(`${this.apiUrl}/complete-match`, body);
  }
  http = inject(HttpClient);
  live = signal<LiveModel | null>(null);
  innings = signal<1 | 2>(1);
  currentBattingTeam = signal(0);
  currentBowlingTeam = signal(1);
  currentBowlerIndex = signal(0);
  isSaving = false;
  tosswin = signal(0);
  tossloss = computed(() => (this.tosswin() === 0 ? 1 : 0));
  players1 = signal<Player[]>([]);
  bowlers1 = signal<Player[]>([]);
  strikerIndex = signal(0);
  nonStrikerIndex = signal(1);
  firstInningsBalls = signal<string[]>([]);
  secondInningsBalls = signal<string[]>([]);

  ball = computed(() =>
    this.innings() === 1 ? this.firstInningsBalls() : this.secondInningsBalls(),
  );

  currentOverBalls = signal<string[]>([]);

  ballColors: Record<string, string> = {
    '0': 'bg-slate-700 border-slate-400 text-white',
    '1': 'bg-sky-700 border-sky-300 text-white',
    '2': 'bg-cyan-700 border-cyan-300 text-white',
    '3': 'bg-violet-600 border-violet-300 text-white',
    '4': 'bg-indigo-600 border-indigo-300 text-white',
    '6': 'bg-emerald-600 border-emerald-300 text-white',
    W: 'bg-rose-600 border-rose-300 text-white',
    Nb: 'bg-amber-500 border-amber-200 text-white',
    Wd: 'bg-zinc-800 border-zinc-400 text-white',
  };

  // LOAD MATCH
  loadMatchIntoService(match: LiveModel) {
    const previousMatchNo = this.live()?.matchNo;

    // New match loaded
    if (previousMatchNo && previousMatchNo !== match.matchNo) {
      this.firstInningsBalls.set([]);
      this.secondInningsBalls.set([]);
      this.currentOverBalls.set([]);
    }

    const cloned = structuredClone(match);

    this.live.set(cloned);

    this.firstInningsBalls.set(cloned.firstInningsBalls ?? []);
    this.secondInningsBalls.set(cloned.secondInningsBalls ?? []);
    this.resetRuntimeState();
  }
  // RESET / RESTORE RUNTIME STATE FROM DB
  resetRuntimeState() {
    const live = this.live();

    if (!live) return;

    const previousInnings = this.innings();

    this.innings.set(live.currentInnings ?? 1);

    if (previousInnings !== live.currentInnings) {
      this.currentOverBalls.set([]);

      if (live.currentInnings === 2) {
        this.secondInningsBalls.set([]);
      }
    }
    if (live.currentBattingTeamIndex == null || live.currentBowlingTeamIndex == null) {
      return;
    }

    this.currentBattingTeam.set(live.currentBattingTeamIndex);

    this.currentBowlingTeam.set(live.currentBowlingTeamIndex);

    this.initCurrentInningsPlayers();
  }
  // TOSS SETUP

  // INIT CURRENT INNINGS PLAYERS
  initCurrentInningsPlayers() {
    const live = this.live();
    if (!live) return;

    const battingIndex = this.currentBattingTeam();
    const bowlingIndex = this.currentBowlingTeam();

    // Match not started yet
    if (battingIndex == null || bowlingIndex == null) {
      this.players1.set([]);
      this.bowlers1.set([]);

      return;
    }

    const battingTeam = live.teams.find((t) => t.teamId === this.currentBattingTeam());

    const bowlingTeam = live.teams.find((t) => t.teamId === this.currentBowlingTeam());

    if (!battingTeam || !bowlingTeam) {
      return;
    }

    const battingPlayers = structuredClone(battingTeam.players);

    this.players1.set(battingPlayers);

    const strikerIndex = battingPlayers.findIndex((p) => p.playerId === live.strikerPlayerId);

    const nonStrikerIndex = battingPlayers.findIndex((p) => p.playerId === live.nonStrikerPlayerId);

    this.strikerIndex.set(strikerIndex === -1 ? 0 : strikerIndex);

    this.nonStrikerIndex.set(nonStrikerIndex === -1 ? 1 : nonStrikerIndex);

    const bowlers = structuredClone(bowlingTeam.players).filter(
      (p) => p.role === 'Bowler' || p.role === 'All-Rounder',
    );

    this.bowlers1.set(bowlers);

    const bowlerIndex = bowlers.findIndex((p) => p.playerId === live.currentBowlerPlayerId);

    this.currentBowlerIndex.set(bowlerIndex === -1 ? 0 : bowlerIndex);
  }
  // GETTERS
  get striker(): Player | undefined {
    return this.players1()[this.strikerIndex()];
  }
  get nonStriker(): Player | undefined {
    return this.players1()[this.nonStrikerIndex()];
  }
  get currentBowler(): Player | undefined {
    return this.bowlers1()[this.currentBowlerIndex()];
  }

  // BALL PROCESSOR
  processBall(ball: string): Observable<void> {
    return new Observable<void>((observer) => {
      const live = this.live();

      if (!live) {
        observer.complete();
        return;
      }

      const body = {
        matchNo: live.matchNo,
        ballResult: ball,
      };

      this.ProcessBall(body).subscribe({
        next: () => {
          // Store innings balls
          if (this.innings() === 1) {
            this.firstInningsBalls.update((current) => [...current, ball]);
          } else {
            this.secondInningsBalls.update((current) => [...current, ball]);
          }

          // Store current over balls
          this.currentOverBalls.update((current) => {
            const updated = [...current, ball];

            const legalBalls = updated.filter((b) => b !== 'WD' && b !== 'NB').length;

            if (legalBalls === 6) {
              return [];
            }

            return updated;
          });

          this.GetLiveMatch().subscribe({
            next: (updatedMatch) => {
              this.loadMatchIntoService(updatedMatch);

              observer.next();
              observer.complete();
            },

            error: (err) => {
              console.error(err);
              observer.error(err);
            },
          });
        },

        error: (err) => {
          console.error(err);
          observer.error(err);
        },
      });
    });
  }
  changeBowler(bowlerPlayerId: number) {
    const live = this.live();

    if (!live) return;

    const body = {
      matchNo: live.matchNo,
      bowlerPlayerId: bowlerPlayerId,
    };

    this.ChangeBowler(body).subscribe({
      next: (res) => {
        this.GetLiveMatch().subscribe({
          next: (match) => this.loadMatchIntoService(match),
        });
      },

      error: (err) => {
        console.log('PUT ERROR');
        console.log(err);
        console.log(err.error);
      },
    });
  }
  canCompleteMatch(): boolean {
    const live = this.live();

    if (!live) return false;

    return live.status === 'Completed';
  }
}
