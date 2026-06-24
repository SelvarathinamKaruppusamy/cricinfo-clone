import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LiveModel } from '../LivePages/Models/models';
import { HttpClient } from '@angular/common/http';
import { LiveService } from '../LivePages/Services/live-service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  http = inject(HttpClient);
  liveService = inject(LiveService);

  // =========================
  // UPCOMING / COMPLETED API
  // =========================
  GetUpcomingMatches(): Observable<LiveModel[]> {
    return this.http.get<LiveModel[]>('http://localhost:5000/matches').pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  GetCompletedMatches(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:7000/completed').pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  AddCompletedMatch(match: any): Observable<any> {
    return this.http.post<any>('http://localhost:7000/completed', match).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  DeleteUpcomingMatch(id: string | number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/matches/${id}`).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  // =========================
  // HELPERS
  // =========================
  oversToBalls(overs: number | string | null | undefined): number {
    if (overs == null) return 0;

    const overNum = Number(overs);
    const fullOvers = Math.floor(overNum);
    const ballsPart = Math.round((overNum - fullOvers) * 10);

    return fullOvers * 6 + ballsPart;
  }

  generateResultFromScores(liveMatch: LiveModel): string {
    const team1 = liveMatch.teams[0];
    const team2 = liveMatch.teams[1];

    if ((team1.scores ?? 0) > (team2.scores ?? 0)) {
      return `${team1.fullName} won by ${(team1.scores ?? 0) - (team2.scores ?? 0)} runs`;
    }

    if ((team2.scores ?? 0) > (team1.scores ?? 0)) {
      const wicketsLeft = 10 - (team2.wickets ?? 0);
      return `${team2.fullName} won by ${wicketsLeft} wickets`;
    }

    return 'Match tied';
  }

  // =========================
  // LIVE -> COMPLETED
  // =========================
  buildCompletedMatchFromLive(
    liveMatch: LiveModel,
    resultText: string,
    playerOfMatch: string
  ) {
    const completedTeams = liveMatch.teams.map((team) => {
      const totalRuns = team.scores ?? 0;
      const totalWickets = team.wickets ?? 0;
      const totalOvers = team.overs ?? 0;
      const totalBalls = this.oversToBalls(totalOvers);

      const batting = team.players.map((player) => ({
        id: player.id,
        name: player.name,
        role: player.role,
        runs: player.runs ?? null,
        balls: player.balls ?? null,
        fours: player.fours ?? null,
        sixes: player.sixes ?? null,
        strikeRate: player.strikeRate ?? null,
        status:
          player.status && player.status.trim() !== ''
            ? player.status
            : 'Did Not Bat',
      }));

      const bowling = team.players
        .filter((player) => player.role === 'Bowler' || player.role === 'All-Rounder')
        .map((player) => ({
          id: player.id,
          name: player.name,
          role: player.role,
          overs: String(player.overs ?? 0),
          balls: this.oversToBalls(player.overs ?? 0),
          maidens: player.maidens ?? 0,
          runsConceded: player.runsConceded ?? 0,
          wickets: player.wickets ?? 0,
          economy: player.economy ?? 0,
        }));

      return {
        teamId: team.teamId,
        fullName: team.fullName,
        shortName: team.shortName,
        logo: team.logo,
        scores: `${totalRuns}/${totalWickets}`,
        runs: totalRuns,
        wickets: totalWickets,
        extras: team.extras ?? 0,
        overs: String(totalOvers),
        balls: totalBalls,
        winCount: team.winCount,
        lossCount: team.lossCount,
        totalMatch: team.totalMatch,
        matchStatus: team.matchStatus,
        batting,
        bowling,
      };
    });

    return {
      matchNo: liveMatch.matchNo,
      venue: liveMatch.venue,
      city: liveMatch.city,
      date: liveMatch.date,
      tossWinner: liveMatch.tossWinner,
      tossDecision: liveMatch.tossDecision,
      result: resultText,
      playerOfTheMatch: playerOfMatch,
      status: 'COMPLETED',
      teams: completedTeams,
    };
  }

  // =========================
  // UPCOMING -> LIVE
  // =========================
  buildLiveMatchFromUpcoming(upcomingMatch: LiveModel): LiveModel {
    return {
      ...structuredClone(upcomingMatch),
      status: 'LIVE',
      tossWinner: null,
      tossDecision: null,
      result: null,
      playerOfTheMatch: null,
      innings: 1,
      currentBattingTeamIndex: null,
      currentBowlingTeamIndex: null,
      strikerPlayerId: null,
      nonStrikerPlayerId: null,
      currentBowlerPlayerId: null,
      teams: upcomingMatch.teams.map((team) => ({
        ...team,
        scores: 0,
        wickets: 0,
        extras: 0,
        overs: 0,
        players: team.players.map((player) => ({
          ...player,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          status: '',
          overs: 0,
          wickets: 0,
          maidens: 0,
          runsConceded: 0,
          economy: 0,
        })),
      })),
    };
  }

  // =========================
  // COMPLETE MATCH + PROMOTE UPCOMING
  // =========================
  completeMatchAndPromoteUpcoming(playerOfMatch: string, resultText?: string) {
    const liveMatch = this.liveService.live();
    if (!liveMatch) return;

    const finalResult = resultText?.trim()
      ? resultText.trim()
      : this.generateResultFromScores(liveMatch);

    this.GetUpcomingMatches().subscribe({
      next: (upcomingMatches) => {
        if (!upcomingMatches?.length) {
          alert('No upcoming matches available');
          return;
        }

        const nextUpcoming = structuredClone(upcomingMatches[0]);

        const completedPayload = this.buildCompletedMatchFromLive(
          structuredClone(liveMatch),
          finalResult,
          playerOfMatch
        );

        const nextLivePayload = this.buildLiveMatchFromUpcoming(nextUpcoming);

        this.AddCompletedMatch(completedPayload).subscribe({
          next: () => {
            this.liveService.UpdateMatch(liveMatch.id, nextLivePayload).subscribe({
              next: (updatedLive) => {
                this.DeleteUpcomingMatch(nextUpcoming.id).subscribe({
                  next: () => {
                    this.liveService.live.set(structuredClone(updatedLive));
                    this.liveService.resetRuntimeState();
                    alert('Match moved to Completed and next Upcoming moved to Live.');
                  },
                  error: (err) => console.error('Delete upcoming failed', err),
                });
              },
              error: (err) => console.error('Update live failed', err),
            });
          },
          error: (err) => console.error('Add completed failed', err),
        });
      },
      error: (err) => console.error('Fetch upcoming failed', err),
    });
  }
}
