import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LiveModel, Player, Team } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  private readonly apiUrl = 'https://localhost:7144/api/live';
  GetLiveMatch(matchNo: number): Observable<LiveModel> {
  return this.http.get<LiveModel>(
    `${this.apiUrl}/${matchNo}`
  );
}

UpdateToss(matchNo: number, body: any): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/match/${matchNo}`,
    body
  );
}

StartMatch(matchNo: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/start-match/${matchNo}`,
    {}
  );
}

ProcessBall(body: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/ball`,
    body
  );
}

ChangeBowler(body: any): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/change-bowler`,
    body
  );
}

UpdatePlayerOfMatch(matchNo: number, body: any): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${matchNo}/player-of-the-match`,
    body
  );
}

  http = inject(HttpClient);
  live = signal<LiveModel | null>(null);
  innings = signal<1 | 2>(1);
  currentBattingTeam = signal(0);
  currentBowlingTeam = signal(1);
  currentBowlerIndex = signal(0);
 
  tosswin = signal(0);
  tossloss = computed(() => (this.tosswin() === 0 ? 1 : 0));
  players1 = signal<Player[]>([]);
  bowlers1 = signal<Player[]>([]);
  strikerIndex = signal(0);
  nonStrikerIndex = signal(1);
  

  currentOverBalls = signal<string[]>([]);
  

  // ball = computed(() =>
  //   this.innings() === 1 ? this.firstInningsBalls() : this.secondInningsBalls(),
  // );
  
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
    const cloned = structuredClone(match);
    this.live.set(cloned);
    this.resetRuntimeState();
  }
  // RESET / RESTORE RUNTIME STATE FROM DB
 resetRuntimeState() {

    const live = this.live();

    if (!live) return;

    this.innings.set(live.currentInnings);

    this.currentBattingTeam.set(live.currentBattingTeamIndex);

    this.currentBowlingTeam.set(live.currentBowlingTeamIndex);

    this.initCurrentInningsPlayers();

}
  // TOSS SETUP
  
  // INIT CURRENT INNINGS PLAYERS
 initCurrentInningsPlayers() {

  const live = this.live();

  if (!live) return;

  const battingTeam = live.teams[this.currentBattingTeam()];
  const bowlingTeam = live.teams[this.currentBowlingTeam()];

  const battingPlayers = structuredClone(battingTeam.players);

  this.players1.set(battingPlayers);

  const strikerIndex =
    battingPlayers.findIndex(
      p => p.id === live.strikerPlayerId
    );

  const nonStrikerIndex =
    battingPlayers.findIndex(
      p => p.id === live.nonStrikerPlayerId
    );

  this.strikerIndex.set(
    strikerIndex === -1 ? 0 : strikerIndex
  );

  this.nonStrikerIndex.set(
    nonStrikerIndex === -1 ? 1 : nonStrikerIndex
  );

  const bowlers = structuredClone(bowlingTeam.players)
    .filter(p =>
      p.role === 'Bowler' ||
      p.role === 'All-Rounder'
    );

  this.bowlers1.set(bowlers);

  const bowlerIndex =
    bowlers.findIndex(
      p => p.id === live.currentBowlerPlayerId
    );

  this.currentBowlerIndex.set(
    bowlerIndex === -1 ? 0 : bowlerIndex
  );
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
  processBall(ball: string) {

  const live = this.live();

  if (!live) return;

  const body = {

    matchNo: live.matchNo,

    ballResult: ball

  };

  this.ProcessBall(body).subscribe({

    next: () => {

      this.GetLiveMatch(live.matchNo).subscribe({

        next: (updatedMatch) => {

          this.loadMatchIntoService(updatedMatch);

        },

        error: (err) => {

          console.error('Failed to reload match', err);

        }

      });

    },

    error: (err) => {

      console.error('Process ball failed', err);

    }

  });

}
  // editLastBall(newBall: string) {
  //   const live = this.live();
  //   if (!live) return;
  //   let striker = this.striker;
  //   let nonstriker = this.nonStriker;
  //   const bowler = this.currentBowler;
  //   if (!striker || !nonstriker || !bowler) return;
  //   const inningsBalls =
  //     this.innings() === 1 ? [...this.firstInningsBalls()] : [...this.secondInningsBalls()];
  //   if (!inningsBalls.length) return;
  //   const oldBall = inningsBalls[inningsBalls.length - 1];
  //   if (oldBall === newBall) return;
  //   const battingTeam = live.teams[this.currentBattingTeam()];
  //   const players = [...this.players1()];
  //   // 1) REMOVE OLD BALL EFFECT
  //   const oldRuns = this.calculateScore(oldBall);
  //   battingTeam.scores = Math.max(0, battingTeam.scores - oldRuns);
  //   // ---------- OLD BALL = WIDE / NO BALL ----------
  //   if (oldBall === 'Wd' || oldBall === 'Nb') {
  //     battingTeam.extras = Math.max(0, battingTeam.extras - 1);
  //     bowler.runsConceded = Math.max(0, bowler.runsConceded - 1);
  //   }
  //   // ---------- OLD BALL = WICKET ----------
  //   else if (oldBall === 'W') {
  //     battingTeam.wickets = Math.max(0, battingTeam.wickets - 1);
  //     bowler.wickets = Math.max(0, bowler.wickets - 1);
  //     this.currentinningswickets--;
  //     // after wicket, current striker is usually the NEW batter
  //     // dismissed batter is the player with status === 'Out'
  //     const outIndex = players.findIndex((p) => p.status === 'Out');
  //     const currentStrikerIndex = this.strikerIndex();
  //     if (outIndex !== -1) {
  //       // restore dismissed batter
  //       players[outIndex] = {
  //         ...players[outIndex],
  //         status: 'Not Out',
  //         balls: Math.max(0, (players[outIndex].balls ?? 0) - 1),
  //       };
  //       // if current striker is replacement batter, remove him
  //       if (currentStrikerIndex !== outIndex) {
  //         const replacement = players[currentStrikerIndex];
  //         if (
  //           replacement &&
  //           replacement.status === 'Not Out' &&
  //           (replacement.runs ?? 0) === 0 &&
  //           (replacement.balls ?? 0) === 0
  //         ) {
  //           players[currentStrikerIndex] = {
  //             ...replacement,
  //             status: '',
  //           };
  //         }
  //       }
  //       striker = players[outIndex];
  //     }
  //   }
  //   // ---------- OLD BALL = NORMAL LEGAL BALL ----------
  //   else {
  //     // So first revert strike to get the actual batter who played old ball.
  //     if (oldBall === '1' || oldBall === '3') {
  //       const temp = striker;
  //       striker = nonstriker;
  //       nonstriker = temp;
  //     }
  //     const strikerIndex = players.findIndex((p) => p.id === striker?.id);
  //     if (strikerIndex !== -1) {
  //       players[strikerIndex] = {
  //         ...players[strikerIndex],
  //         balls: Math.max(0, (players[strikerIndex].balls ?? 0) - 1),
  //         runs: Math.max(0, (players[strikerIndex].runs ?? 0) - oldRuns),
  //         fours:
  //           oldBall === '4'
  //             ? Math.max(0, (players[strikerIndex].fours ?? 0) - 1)
  //             : (players[strikerIndex].fours ?? 0),
  //         sixes:
  //           oldBall === '6'
  //             ? Math.max(0, (players[strikerIndex].sixes ?? 0) - 1)
  //             : (players[strikerIndex].sixes ?? 0),
  //       };
  //       striker = players[strikerIndex];
  //     }
  //     bowler.runsConceded = Math.max(0, bowler.runsConceded - oldRuns);
  //   }
  //   // ---------- REMOVE LEGAL BALL COUNT OF OLD BALL ----------
  //   if (this.isLegalBall(oldBall)) {
  //     this.legalBalls.update((v) => Math.max(0, v - 1));
  //     this.inningsBalls.update((v) => Math.max(0, v - 1));
  //     const bowlerCount = { ...this.bowlerBallCount() };
  //     bowlerCount[bowler.id] = Math.max(0, (bowlerCount[bowler.id] || 0) - 1);
  //     this.bowlerBallCount.set(bowlerCount);
  //     const bowlerBalls = bowlerCount[bowler.id] || 0;
  //     bowler.overs = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;
  //   }
  //   // 2) APPLY NEW BALL EFFECT
  //   const newRuns = this.calculateScore(newBall);
  //   battingTeam.scores += newRuns;
  //   // ---------- NEW BALL = WIDE / NO BALL ----------
  //   if (newBall === 'Wd' || newBall === 'Nb') {
  //     battingTeam.extras += 1;
  //     bowler.runsConceded += 1;
  //   }
  //   // ---------- NEW BALL = WICKET ----------
  //   else if (newBall === 'W') {
  //     this.currentinningswickets++;
  //     const strikerIndex = players.findIndex((p) => p.id === striker?.id);
  //     if (strikerIndex === -1) return;
  //     // mark striker out
  //     players[strikerIndex] = {
  //       ...players[strikerIndex],
  //       balls: (players[strikerIndex].balls ?? 0) + 1,
  //       status: 'Out',
  //     };
  //     battingTeam.wickets += 1;
  //     bowler.wickets += 1;
  //     this.legalBalls.update((v) => v + 1);
  //     this.inningsBalls.update((v) => v + 1);
  //     const bowlerCount = { ...this.bowlerBallCount() };
  //     bowlerCount[bowler.id] = (bowlerCount[bowler.id] || 0) + 1;
  //     this.bowlerBallCount.set(bowlerCount);
  //     const bowlerBalls = bowlerCount[bowler.id];
  //     bowler.overs = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;
  //     // bring next batter
  //     const nextIndex = players.findIndex(
  //       (p, index) =>
  //         index !== strikerIndex &&
  //         index !== this.nonStrikerIndex() &&
  //         p.status !== 'Out' &&
  //         p.status !== 'Not Out',
  //     );
  //     if (nextIndex !== -1) {
  //       players[nextIndex] = {
  //         ...players[nextIndex],
  //         status: 'Not Out',
  //       };
  //       striker = players[nextIndex];
  //     } else {
  //       striker = players[strikerIndex];
  //     }
  //     if(this.currentinningswickets===10 && this.innings()!==2){
  //       this.startSecondInnings()
  //     }
  //   }
  //   // ---------- NEW BALL = NORMAL LEGAL BALL ----------
  //   else {
  //     const strikerIndex = players.findIndex((p) => p.id === striker?.id);
  //     if (strikerIndex === -1) return;
  //     players[strikerIndex] = {
  //       ...players[strikerIndex],
  //       balls: (players[strikerIndex].balls ?? 0) + 1,
  //       runs: (players[strikerIndex].runs ?? 0) + newRuns,
  //       fours:
  //         newBall === '4'
  //           ? (players[strikerIndex].fours ?? 0) + 1
  //           : (players[strikerIndex].fours ?? 0),
  //       sixes:
  //         newBall === '6'
  //           ? (players[strikerIndex].sixes ?? 0) + 1
  //           : (players[strikerIndex].sixes ?? 0),
  //     };
  //     striker = players[strikerIndex];
  //     bowler.runsConceded += newRuns;
  //     this.legalBalls.update((v) => v + 1);
  //     this.inningsBalls.update((v) => v + 1);
  //     const bowlerCount = { ...this.bowlerBallCount() };
  //     bowlerCount[bowler.id] = (bowlerCount[bowler.id] || 0) + 1;
  //     this.bowlerBallCount.set(bowlerCount);
  //     const bowlerBalls = bowlerCount[bowler.id];
  //     bowler.overs = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;
  //     // swap strike after applying 1 or 3
  //     if (newBall === '1' || newBall === '3') {
  //       const temp = striker;
  //       striker = nonstriker;
  //       nonstriker = temp;
  //     }
  //   }
  //   // 3) SAVE UPDATED PLAYERS BACK INTO SIGNAL
  //   this.players1.set(players);
  //   // 4) UPDATE STRIKER / NON STRIKER INDEX
  //   const strikerIdx = players.findIndex((p) => p.id === striker?.id);
  //   const nonStrikerIdx = players.findIndex((p) => p.id === nonstriker?.id);
  //   if (strikerIdx !== -1) this.strikerIndex.set(strikerIdx);
  //   if (nonStrikerIdx !== -1) this.nonStrikerIndex.set(nonStrikerIdx);
  //   // 5) RECALCULATE STRIKE RATE / ECONOMY / TEAM OVERS
  //   const updatedPlayers = [...this.players1()].map((player) => ({
  //     ...player,
  //     strikeRate:
  //       (player.balls ?? 0) > 0
  //         ? Number((((player.runs ?? 0) / (player.balls ?? 1)) * 100).toFixed(2))
  //         : 0,
  //   }));
  //   this.players1.set(updatedPlayers);
  //   const bowlerBalls = this.bowlerBallCount()[bowler.id] || 0;
  //   bowler.economy =
  //     bowlerBalls > 0 ? Number((bowler.runsConceded / (bowlerBalls / 6)).toFixed(2)) : 0;
  //   battingTeam.overs = Math.floor(this.inningsBalls() / 6) + (this.inningsBalls() % 6) / 10;
  //   // 6) REPLACE LAST BALL IN BALL ARRAY
  //   inningsBalls[inningsBalls.length - 1] = newBall;
  //   if (this.innings() === 1) {
  //     this.firstInningsBalls.set(inningsBalls);
  //   } else {
  //     this.secondInningsBalls.set(inningsBalls);
  //   }
  //   // 7) REBUILD CURRENT OVER BALLS
  //   const rebuiltCurrentOver: string[] = [];
  //   let legalCount = 0;
  //   for (let i = inningsBalls.length - 1; i >= 0; i--) {
  //     rebuiltCurrentOver.unshift(inningsBalls[i]);
  //     if (inningsBalls[i] !== 'Wd' && inningsBalls[i] !== 'Nb') {
  //       legalCount++;
  //     }
  //     if (legalCount === this.legalBalls()) break;
  //   }
  //   this.currentOverBalls.set(rebuiltCurrentOver);
  //   // 8) SYNC TO LIVE + SAVE
  //   this.syncCurrentPlayersToLive();
  //   this.saveLiveToDb();
  // }

 
  
changeBowler(bowlerPlayerId: number) {

  const live = this.live();

  if (!live) return;

  const body = {
    matchNo: live.matchNo,
    bowlerPlayerId: bowlerPlayerId
  };

  this.ChangeBowler(body).subscribe({

    next: () => {

      this.GetLiveMatch(live.matchNo).subscribe({

        next: (updatedMatch) => {

          this.loadMatchIntoService(updatedMatch);

        },

        error: (err) => console.error(err)

      });

    },

    error: (err) => console.error(err)

  });

}
}
