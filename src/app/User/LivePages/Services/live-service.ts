import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LiveModel, Player, Team } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  http = inject(HttpClient);

  // =========================
  // MAIN MATCH SIGNALS
  // =========================
  live = signal<LiveModel | null>(null);

  innings = signal<1 | 2>(1);
  currentBattingTeam = signal(0);
  currentBowlingTeam = signal(1);
  currentBowlerIndex = signal(0);

  tossWinner = signal<0 | 1 | null>(null);
  tossCall = signal<'Head' | 'Tail' | null>(null);
  tossDecision = signal<'Bat' | 'Bowl' | null>(null);

  tosswin = signal(0);
  tossloss = computed(() => (this.tosswin() === 0 ? 1 : 0));

  // =========================
  // CURRENT INNINGS STATE
  // =========================
  players1 = signal<Player[]>([]);
  bowlers1 = signal<Player[]>([]);

  strikerIndex = signal(0);
  nonStrikerIndex = signal(1);

  legalBalls = signal(0);
  inningsBalls = signal(0);
  currentOverRuns = signal(0);

  bowlerBallCount = signal<Record<number, number>>({});

  firstInningsBalls = signal<string[]>([]);
  secondInningsBalls = signal<string[]>([]);

  isSaving=false;
  currentOverBalls = signal<string[]>([]);

  ball = computed(() =>
    this.innings() === 1 ? this.firstInningsBalls() : this.secondInningsBalls(),
  );

  // completed innings snapshots
  completedBatters = signal<Player[]>([]);
  completedBowlers = signal<Player[]>([]);
  completedBattingTeam?: Team;
  completedBowlingTeam?: Team;

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

  // =========================
  // API
  // =========================
  GetLiveMatches(): Observable<LiveModel[]> {
    return this.http.get<LiveModel[]>('http://localhost:3000/matches').pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  UpdateMatch(matchId: string | number, match: Partial<LiveModel>): Observable<LiveModel> {
    return this.http.put<LiveModel>(`http://localhost:3000/matches/${matchId}`, match).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      }),
    );
  }

  // =========================
  // LOAD MATCH
  // =========================
  loadMatchIntoService(match: LiveModel) {
    const cloned = structuredClone(match);
    this.live.set(cloned);
    this.resetRuntimeState();
  }

  // =========================
  // RESET / RESTORE RUNTIME STATE FROM DB
  // =========================
  resetRuntimeState() {
    const live = this.live();
    if (!live) return;

    // restore completed first innings snapshots
    this.completedBattingTeam = live.firstInningsCompletedBattingTeam
      ? structuredClone(live.firstInningsCompletedBattingTeam)
      : undefined;

    this.completedBowlingTeam = live.firstInningsCompletedBowlingTeam
      ? structuredClone(live.firstInningsCompletedBowlingTeam)
      : undefined;

    this.completedBatters.set(
      live.firstInningsCompletedBatters ? structuredClone(live.firstInningsCompletedBatters) : [],
    );

    this.completedBowlers.set(
      live.firstInningsCompletedBowlers ? structuredClone(live.firstInningsCompletedBowlers) : [],
    );

    // clear runtime
    this.players1.set([]);
    this.bowlers1.set([]);

    this.strikerIndex.set(0);
    this.nonStrikerIndex.set(1);
    this.currentBowlerIndex.set(0);

    this.legalBalls.set(0);
    this.inningsBalls.set(0);
    this.currentOverRuns.set(0);
    this.bowlerBallCount.set({});
    // this.currentOverBalls.set([]); 

    // restore innings / batting / bowling side from DB
    const savedInnings = live.innings ?? 1;
    const savedBattingIndex = live.currentBattingTeamIndex;
    const savedBowlingIndex = live.currentBowlingTeamIndex;

    this.innings.set(savedInnings === 2 ? 2 : 1);

    // =========================
    // RESTORE BALL HISTORY
    // =========================
    this.firstInningsBalls.set(structuredClone(live.firstInningsBalls ?? []));

    this.secondInningsBalls.set(structuredClone(live.secondInningsBalls ?? []));

    // Toss restore
    if (live.tossWinner && live.tossDecision) {
      const tossWinnerIndex = live.teams[0].shortName === live.tossWinner ? 0 : 1;

      this.tossWinner.set(tossWinnerIndex as 0 | 1);
      this.tossDecision.set(live.tossDecision as 'Bat' | 'Bowl');
      this.tosswin.set(tossWinnerIndex);

      const tossLoserIndex = tossWinnerIndex === 0 ? 1 : 0;

      if (typeof savedBattingIndex === 'number' && typeof savedBowlingIndex === 'number') {
        this.currentBattingTeam.set(savedBattingIndex);
        this.currentBowlingTeam.set(savedBowlingIndex);
      } else {
        if (live.tossDecision === 'Bat') {
          this.currentBattingTeam.set(tossWinnerIndex);
          this.currentBowlingTeam.set(tossLoserIndex);
        } else {
          this.currentBattingTeam.set(tossLoserIndex);
          this.currentBowlingTeam.set(tossWinnerIndex);
        }
      }
    } else {
      this.tossWinner.set(null);
      this.tossDecision.set(null);
      this.currentBattingTeam.set(0);
      this.currentBowlingTeam.set(1);
    }

    this.initCurrentInningsPlayers();
  }

  // =========================
  // TOSS SETUP
  // =========================
  setToss(tossWinnerIndex: 0 | 1, call: 'Head' | 'Tail', decision: 'Bat' | 'Bowl') {
    const live = this.live();
    if (!live) return;

    const tossLoserIndex = tossWinnerIndex === 0 ? 1 : 0;

    this.tossWinner.set(tossWinnerIndex);
    this.tossCall.set(call);
    this.tossDecision.set(decision);
    this.tosswin.set(tossWinnerIndex);

    if (decision === 'Bat') {
      this.currentBattingTeam.set(tossWinnerIndex);
      this.currentBowlingTeam.set(tossLoserIndex);
    } else {
      this.currentBattingTeam.set(tossLoserIndex);
      this.currentBowlingTeam.set(tossWinnerIndex);
    }

    this.live.update((match) => {
      if (!match) return match;

      return {
        ...match,
        tossWinner: match.teams[tossWinnerIndex].shortName,
        tossDecision: decision,
        innings: this.innings(),
        currentBattingTeamIndex: this.currentBattingTeam(),
        currentBowlingTeamIndex: this.currentBowlingTeam(),
      };
    });

    this.initCurrentInningsPlayers();
    this.syncCurrentPlayersToLive();
    this.saveLiveToDb();
  }

  // =========================
  // INIT CURRENT INNINGS PLAYERS
  // =========================
  initCurrentInningsPlayers() {
    const live = this.live();
    if (!live) return;

    const battingIndex = this.currentBattingTeam();
    const bowlingIndex = this.currentBowlingTeam();

    const battingTeam = live.teams[battingIndex];
    const bowlingTeam = live.teams[bowlingIndex];

    // restore batting players
    const battingPlayers = structuredClone(battingTeam.players).map((player) => ({
      ...player,
      runs: player.runs ?? 0,
      balls: player.balls ?? 0,
      fours: player.fours ?? 0,
      sixes: player.sixes ?? 0,
      strikeRate: player.strikeRate ?? 0,
      status: player.status ?? '',
    }));

    this.players1.set(battingPlayers);

    // restore striker / non-striker exactly using stored ids
    const savedStrikerId = live.strikerPlayerId;
    const savedNonStrikerId = live.nonStrikerPlayerId;

    let strikerIndex = 0;
    let nonStrikerIndex = 1;

    if (savedStrikerId != null) {
      const idx = battingPlayers.findIndex((p) => p.id === savedStrikerId);
      if (idx !== -1) strikerIndex = idx;
    }

    if (savedNonStrikerId != null) {
      const idx = battingPlayers.findIndex((p) => p.id === savedNonStrikerId);
      if (idx !== -1) nonStrikerIndex = idx;
    }

    // fallback if ids not stored
    if (savedStrikerId == null || savedNonStrikerId == null) {
      const notOutIndexes = battingPlayers
        .map((p, i) => ({ p, i }))
        .filter((x) => x.p.status === 'Not Out')
        .map((x) => x.i);

      if (notOutIndexes.length >= 2) {
        strikerIndex = notOutIndexes[0];
        nonStrikerIndex = notOutIndexes[1];
      } else {
        battingPlayers.forEach((p) => {
          if (p.status !== 'Out') p.status = '';
        });

        if (battingPlayers[0]) battingPlayers[0].status = 'Not Out';
        if (battingPlayers[1]) battingPlayers[1].status = 'Not Out';

        strikerIndex = 0;
        nonStrikerIndex = 1;
        this.players1.set([...battingPlayers]);
      }
    }

    this.strikerIndex.set(strikerIndex);
    this.nonStrikerIndex.set(nonStrikerIndex);

    // restore bowlers
    const bowlers = structuredClone(bowlingTeam.players)
      .filter((p) => p.role === 'Bowler' || p.role === 'All-Rounder')
      .map((p) => ({
        ...p,
        overs: p.overs ?? 0,
        maidens: p.maidens ?? 0,
        runsConceded: p.runsConceded ?? 0,
        wickets: p.wickets ?? 0,
        economy: p.economy ?? 0,
      }));

    this.bowlers1.set(bowlers);

    // restore current bowler exactly using stored id
    const savedBowlerId = live.currentBowlerPlayerId;
    let bowlerIndex = 0;

    if (savedBowlerId != null) {
      const idx = bowlers.findIndex((b) => b.id === savedBowlerId);
      if (idx !== -1) bowlerIndex = idx;
    }

    this.currentBowlerIndex.set(bowlerIndex);

    // restore innings balls from batting team overs
    const overs = battingTeam.overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs - fullOvers) * 10);
    const totalBalls = fullOvers * 6 + ballsPart;

    this.inningsBalls.set(totalBalls);
    this.legalBalls.set(ballsPart);

    // rebuild current bowler legal ball count from overs stored in DB
    const currentBowler = bowlers[bowlerIndex];
    if (currentBowler) {
      const bowlerOvers = currentBowler.overs ?? 0;
      const fullBowlerOvers = Math.floor(bowlerOvers);
      const bowlerBallsPart = Math.round((bowlerOvers - fullBowlerOvers) * 10);
      const bowlerTotalBalls = fullBowlerOvers * 6 + bowlerBallsPart;

      this.bowlerBallCount.set({
        [currentBowler.id]: bowlerTotalBalls,
      });
    }
  }

  // =========================
  // GETTERS
  // =========================
  get striker(): Player | undefined {
    return this.players1()[this.strikerIndex()];
  }

  get nonStriker(): Player | undefined {
    return this.players1()[this.nonStrikerIndex()];
  }

  get currentBowler(): Player | undefined {
    return this.bowlers1()[this.currentBowlerIndex()];
  }

  // =========================
  // HELPERS
  // =========================
  calculateScore(score: string): number {
    switch (score) {
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

  playerruns(ball: string): number {
    switch (ball) {
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
      default:
        return 0;
    }
  }

  addBallToArray(ball: string) {
    if (this.innings() === 1) {
      const updatedBalls = [...this.firstInningsBalls(), ball];
      this.firstInningsBalls.set(updatedBalls);

      this.live.update((match) => {
        if (!match) return match;
        return {
          ...match,
          firstInningsBalls: updatedBalls,
        };
      });
    } else {
      const updatedBalls = [...this.secondInningsBalls(), ball];
      this.secondInningsBalls.set(updatedBalls);

      this.live.update((match) => {
        if (!match) return match;
        return {
          ...match,
          secondInningsBalls: updatedBalls,
        };
      });
    }
  }

  // =========================
  // BALL PROCESSOR
  // =========================
  processBall(ball: string) {
    const live = this.live();
    if (!live) return;

    const striker = this.striker;
    const bowler = this.currentBowler;

    if (!striker || !bowler) {
      console.log('Striker or bowler missing');
      return;
    }

    this.addBallToArray(ball);

    this.currentOverBalls.update((balls) => [...balls, ball]);

    // Wd / Nb
    if (ball === 'Wd' || ball === 'Nb') {
      this.handleWideNoBall(ball, bowler);
      this.syncCurrentPlayersToLive();
      this.saveLiveToDb();
      return;
    }

    // legal ball
    this.legalBalls.update((v) => v + 1);
    this.inningsBalls.update((v) => v + 1);

    const bowlerCount = { ...this.bowlerBallCount() };
    bowlerCount[bowler.id] = (bowlerCount[bowler.id] || 0) + 1;
    this.bowlerBallCount.set(bowlerCount);

    const bowlerBalls = bowlerCount[bowler.id];
    bowler.overs = Math.floor(bowlerBalls / 6) + (bowlerBalls % 6) / 10;

    live.teams[this.currentBattingTeam()].overs =
      Math.floor(this.inningsBalls() / 6) + (this.inningsBalls() % 6) / 10;

    if (ball === 'W') {
      striker.balls++;
      striker.strikeRate =
        striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(2)) : 0;

      bowler.wickets++;
      this.handleWicket();

      bowler.economy =
        bowlerBalls > 0 ? Number((bowler.runsConceded / (bowlerBalls / 6)).toFixed(2)) : 0;
    } else {
      const run = this.playerruns(ball);

      live.teams[this.currentBattingTeam()].scores += run;

      striker.balls++;
      striker.runs += run;

      if (run === 4) striker.fours++;
      if (run === 6) striker.sixes++;

      striker.strikeRate =
        striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(2)) : 0;

      bowler.runsConceded += run;
      this.currentOverRuns.update((v) => v + run);

      bowler.economy =
        bowlerBalls > 0 ? Number((bowler.runsConceded / (bowlerBalls / 6)).toFixed(2)) : 0;

      if (run === 1 || run === 3) {
        this.swapStrike();
      }
    }

    // over complete
    if (this.legalBalls() === 6) {
      if (this.currentOverRuns() === 0) {
        bowler.maidens++;
      }

      this.swapStrike();
      this.changeBowler();

      this.legalBalls.set(0);
      this.currentOverRuns.set(0);
      this.currentOverBalls.set([]);
    }

    this.syncCurrentPlayersToLive();
    this.saveLiveToDb();
  }

  handleWideNoBall(ball: string, bowler: Player) {
    const live = this.live();
    if (!live) return;

    live.teams[this.currentBattingTeam()].scores += 1;
    live.teams[this.currentBattingTeam()].extras += 1;

    bowler.runsConceded += 1;
    this.currentOverRuns.update((v) => v + 1);

    const bowlerBalls = this.bowlerBallCount()[bowler.id] || 0;
    if (bowlerBalls > 0) {
      bowler.economy = Number((bowler.runsConceded / (bowlerBalls / 6)).toFixed(2));
    }
  }

  handleWicket() {
    const live = this.live();
    const striker = this.striker;
    if (!live || !striker) return;

    striker.status = 'Out';
    live.teams[this.currentBattingTeam()].wickets++;

    const players = [...this.players1()];

    const nextIndex = players.findIndex(
      (p, index) => index !== this.strikerIndex() && p.status !== 'Out' && p.status !== 'Not Out',
    );

    if (nextIndex !== -1) {
      players[nextIndex] = {
        ...players[nextIndex],
        status: 'Not Out',
      };
      this.players1.set(players);
      this.strikerIndex.set(nextIndex);
    } else {
      this.players1.set(players);
    }
  }

  swapStrike() {
    const striker = this.strikerIndex();
    const nonStriker = this.nonStrikerIndex();

    this.strikerIndex.set(nonStriker);
    this.nonStrikerIndex.set(striker);
  }

  changeBowler() {
    const current = this.currentBowlerIndex();

    const availableBowlers = this.bowlers1()
      .map((bowler, index) => ({ bowler, index }))
      .filter((item) => item.index !== current && (item.bowler.overs ?? 0) < 4);

    if (!availableBowlers.length) return;

    const random = Math.floor(Math.random() * availableBowlers.length);
    this.currentBowlerIndex.set(availableBowlers[random].index);
  }

  // =========================
  // SYNC TO LIVE SIGNAL
  // =========================
  syncCurrentPlayersToLive() {
    const live = this.live();
    if (!live) return;

    const battingIndex = this.currentBattingTeam();
    const bowlingIndex = this.currentBowlingTeam();

    const battingTeamPlayers = live.teams[battingIndex].players;
    const bowlingTeamPlayers = live.teams[bowlingIndex].players;

    // sync batting players
    this.players1().forEach((player) => {
      const idx = battingTeamPlayers.findIndex((p) => p.id === player.id);
      if (idx !== -1) {
        battingTeamPlayers[idx] = { ...player };
      }
    });

    // sync bowlers
    this.bowlers1().forEach((bowler) => {
      const idx = bowlingTeamPlayers.findIndex((p) => p.id === bowler.id);
      if (idx !== -1) {
        bowlingTeamPlayers[idx] = {
          ...bowlingTeamPlayers[idx],
          overs: bowler.overs,
          maidens: bowler.maidens,
          wickets: bowler.wickets,
          runsConceded: bowler.runsConceded,
          economy: bowler.economy,
        };
      }
    });

    // persist exact runtime state
    live.innings = this.innings();
    live.currentBattingTeamIndex = this.currentBattingTeam();
    live.currentBowlingTeamIndex = this.currentBowlingTeam();
    live.strikerPlayerId = this.striker?.id ?? null;
    live.nonStrikerPlayerId = this.nonStriker?.id ?? null;
    live.currentBowlerPlayerId = this.currentBowler?.id ?? null;

    // persist completed innings snapshots too
    live.firstInningsCompletedBattingTeam = this.completedBattingTeam
      ? structuredClone(this.completedBattingTeam)
      : null;

    live.firstInningsCompletedBowlingTeam = this.completedBowlingTeam
      ? structuredClone(this.completedBowlingTeam)
      : null;

    live.firstInningsCompletedBatters = structuredClone(this.completedBatters());
    live.firstInningsCompletedBowlers = structuredClone(this.completedBowlers());

    this.live.set(structuredClone(live));
  }

  // =========================
  // FIRST INNINGS COMPLETE
  // =========================
  completeFirstInnings() {
    const live = this.live();
    if (!live) return;

    this.syncCurrentPlayersToLive();

    this.completedBatters.set(structuredClone(this.players1()));
    this.completedBowlers.set(structuredClone(this.bowlers1()));

    this.completedBattingTeam = structuredClone(live.teams[this.currentBattingTeam()]);
    this.completedBowlingTeam = structuredClone(live.teams[this.currentBowlingTeam()]);
  }

  // =========================
  // START 2ND INNINGS
  // =========================
  startSecondInnings() {
    const live = this.live();
    if (!live) return;

    // Save current innings state first
    this.completeFirstInnings();

    const firstInningsBatting = this.currentBattingTeam();
    const firstInningsBowling = this.currentBowlingTeam();

    const completedBatters = structuredClone(this.completedBatters());
    const completedBowlers = structuredClone(this.completedBowlers());
    const completedBattingTeam = structuredClone(this.completedBattingTeam!);
    const completedBowlingTeam = structuredClone(this.completedBowlingTeam!);

    // switch innings
    this.innings.set(2);
    this.currentBattingTeam.set(firstInningsBowling);
    this.currentBowlingTeam.set(firstInningsBatting);

    this.strikerIndex.set(0);
    this.nonStrikerIndex.set(1);
    this.currentBowlerIndex.set(0);
    this.legalBalls.set(0);
    this.inningsBalls.set(0);
    this.currentOverRuns.set(0);
    this.bowlerBallCount.set({});
    this.secondInningsBalls.set([]);
    this.currentOverBalls.set([]);

    const updatedLive = structuredClone(live);

    // store completed first innings snapshot into DB object
    updatedLive.firstInningsCompletedBatters = completedBatters;
    updatedLive.firstInningsCompletedBowlers = completedBowlers;
    updatedLive.firstInningsCompletedBattingTeam = completedBattingTeam;
    updatedLive.firstInningsCompletedBowlingTeam = completedBowlingTeam;

    updatedLive.innings = 2;
    updatedLive.currentBattingTeamIndex = firstInningsBowling;
    updatedLive.currentBowlingTeamIndex = firstInningsBatting;

    const battingTeam = updatedLive.teams[firstInningsBowling];
    const bowlingTeam = updatedLive.teams[firstInningsBatting];

    // reset batting team for second innings
    battingTeam.scores = 0;
    battingTeam.wickets = 0;
    battingTeam.overs = 0;
    battingTeam.extras = 0;

    battingTeam.players = battingTeam.players.map((player, index) => ({
      ...player,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      status: index === 0 || index === 1 ? 'Not Out' : '',
    }));

    // reset bowling figures of bowling side
    bowlingTeam.players = bowlingTeam.players.map((player) => ({
      ...player,
      overs: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
    }));

    // set exact second innings runtime ids
    updatedLive.strikerPlayerId = battingTeam.players[0]?.id ?? null;
    updatedLive.nonStrikerPlayerId = battingTeam.players[1]?.id ?? null;

    const secondInningsBowlers = bowlingTeam.players.filter(
      (p) => p.role === 'Bowler' || p.role === 'All-Rounder',
    );
    updatedLive.currentBowlerPlayerId = secondInningsBowlers[0]?.id ?? null;

    this.live.set(updatedLive);

    // runtime batting lineup
    this.players1.set(structuredClone(battingTeam.players));

    // runtime bowlers
    this.bowlers1.set(
      structuredClone(secondInningsBowlers).map((p) => ({
        ...p,
        overs: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        economy: 0,
      })),
    );

    this.strikerIndex.set(0);
    this.nonStrikerIndex.set(1);
    this.currentBowlerIndex.set(0);

    this.syncCurrentPlayersToLive();
    this.saveLiveToDb();
  }

  canStartSecondInnings(): boolean {
    if (this.innings() !== 1) return false;

    const batting = this.live()?.teams[this.currentBattingTeam()];
    if (!batting) return false;

    return batting.overs >= 20 || batting.wickets >= 10;
  }

  canCompleteMatch(): boolean {
    if (this.innings() !== 2) return false;

    const live = this.live();
    if (!live || !this.completedBattingTeam) return false;

    const secondBatting = live.teams[this.currentBattingTeam()];
    const target = this.completedBattingTeam.scores + 1;

    return (
      secondBatting.scores >= target || secondBatting.overs >= 20 || secondBatting.wickets >= 10
    );
  }

  saveLiveToDb() {
    const live = this.live();
    if (!live) return;

    this.UpdateMatch(live.id, live).subscribe({
      next: (updated) => {
        this.live.set(structuredClone(updated));
        this.resetRuntimeState();
      },
      error: (err) => console.error('DB update failed', err),
    });
  }

  completeMatch() {
    const live = this.live();
    if (!live) return;
    if (!this.completedBattingTeam) return;

    const secondBatting = live.teams[this.currentBattingTeam()];
    const firstBatting = this.completedBattingTeam;

    const target = firstBatting.scores + 1;
    let result = '';

    // chasing team won
    if (secondBatting.scores >= target) {
      const wicketsLeft = 10 - secondBatting.wickets;
      result = `${secondBatting.shortName} won by ${wicketsLeft} wickets`;
    }
    // innings ended and chasing team failed
    else if (secondBatting.overs >= 20 || secondBatting.wickets >= 10) {
      if (secondBatting.scores === firstBatting.scores) {
        result = 'Match Tied';
      } else {
        const margin = firstBatting.scores - secondBatting.scores;
        result = `${firstBatting.shortName} won by ${margin} runs`;
      }
    } else {
      // match not yet complete
      return;
    }

    this.live.update((match) => {
      if (!match) return match;

      return {
        ...match,
        result,
        status: 'COMPLETED',
      };
    });

    this.saveLiveToDb();
  }
}
