import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedService } from '../Completed/Services/completed-service';

import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface PlayerStats {
  name: string;
  role: string;
  team: string;

  matches: number;

  runs: number;
  balls: number;

  fours: number;
  sixes: number;

  strikeRate: number;

  highestScore: number;
  highestScoreMatch: number;
  highestScoreAgainst: string;

  potmAwards: number;

  wickets: number;
  economy: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MatExpansionModule, MatAccordion, MatListModule, MatIconModule, MatCardModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats {
  private route = inject(ActivatedRoute);
  private completedService = inject(CompletedService);

  statType = '';
  matches: any[] = [];
  teams: any[] = [];
  selectedPlayer: any = null;
  selectedTeam: any = null;
  playerStats!: PlayerStats;
  purpleCapList: any[] = [];
  orangeCapList: any[] = [];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.statType = params['type'];
    });

    this.loadCompletedMatches();
  }

  loadCompletedMatches() {
    this.completedService.getCompletedMatches().subscribe({
      next: (data: any) => {
        this.matches = data;

        this.loadTeams();
        this.calculatePurpleCap();
        this.calculateOrangeCap();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadTeams() {
    const uniqueTeams = new Map();

    this.matches.forEach((match: any) => {
      match.teams.forEach((team: any) => {
        if (!uniqueTeams.has(team.teamId)) {
          uniqueTeams.set(team.teamId, team);
        }
      });
    });

    this.teams = Array.from(uniqueTeams.values());
  }

  getPlayersForTeam(teamId: number) {
    const uniquePlayers = new Map();

    this.matches.forEach((match: any) => {
      match.teams.forEach((team: any) => {
        if (team.teamId === teamId) {
          team.batting?.forEach((player: any) => {
            const playerKey = player.id ?? player.playerId;

            if (!uniquePlayers.has(playerKey)) {
              uniquePlayers.set(playerKey, player);
            }
          });
        }
      });
    });

    return Array.from(uniquePlayers.values());
  }

  selectPlayer(player: any, team: any) {
    this.selectedPlayer = player;
    this.selectedTeam = team;

    this.calculatePlayerStats();
  }

  calculatePlayerStats() {
    const selectedPlayerId = this.selectedPlayer.id ?? this.selectedPlayer.playerId;

    const stats: PlayerStats = {
      name: this.selectedPlayer.name,
      role: this.selectedPlayer.role,
      team: this.selectedTeam.shortName,

      matches: 0,

      runs: 0,
      balls: 0,

      fours: 0,
      sixes: 0,

      strikeRate: 0,

      highestScore: 0,
      highestScoreMatch: 0,
      highestScoreAgainst: '',

      potmAwards: 0,

      wickets: 0,
      economy: 0,
    };

    let economyRuns = 0;
    let economyBalls = 0;

    this.matches.forEach((match: any) => {
      match.teams.forEach((team: any) => {
        // BATTING

        team.batting?.forEach((player: any) => {
          const playerId = player.id ?? player.playerId;

          if (playerId === selectedPlayerId) {
            stats.matches++;

            stats.runs += player.runs || 0;
            stats.balls += player.balls || 0;

            stats.fours += player.fours || 0;
            stats.sixes += player.sixes || 0;

            if ((player.runs || 0) > stats.highestScore) {
              stats.highestScore = player.runs || 0;
              stats.highestScoreMatch = match.matchNo;

              const opponent = match.teams.find((t: any) => t.teamId !== team.teamId);

              stats.highestScoreAgainst = opponent?.shortName || '';
            }

            if (match.playerOfTheMatch === player.name) {
              stats.potmAwards++;
            }
          }
        });

        // BOWLING

        team.bowling?.forEach((bowler: any) => {
          const bowlerId = bowler.id ?? bowler.playerId;

          if (bowlerId === selectedPlayerId) {
            stats.wickets += bowler.wickets || 0;

            economyRuns += bowler.runsConceded || bowler.runs || 0;

            economyBalls += bowler.balls || bowler.ballsBowled || 0;
          }
        });
      });
    });

    stats.strikeRate = stats.balls > 0 ? Number(((stats.runs * 100) / stats.balls).toFixed(2)) : 0;

    stats.economy = economyBalls > 0 ? Number((economyRuns / (economyBalls / 6)).toFixed(2)) : 0;

    this.playerStats = stats;
  }

  calculatePurpleCap() {
    const bowlers = new Map();

    this.matches.forEach((match: any) => {
      match.teams.forEach((team: any) => {
        team.bowling?.forEach((bowler: any) => {
          const bowlerId = bowler.id ?? bowler.playerId;

          if (!bowlers.has(bowlerId)) {
            bowlers.set(bowlerId, {
              name: bowler.name,
              wickets: 0,
              matches: 0,
              economyRuns: 0,
              economyBalls: 0,
            });
          }

          const b = bowlers.get(bowlerId);

          b.wickets += bowler.wickets || 0;
          b.matches += 1;

          b.economyRuns += bowler.runsConceded || bowler.runs || 0;

          b.economyBalls += bowler.balls || bowler.ballsBowled || 0;
        });
      });
    });

    this.purpleCapList = Array.from(bowlers.values())
      .map((b: any) => ({
        ...b,
        economy: b.economyBalls > 0 ? Number((b.economyRuns / (b.economyBalls / 6)).toFixed(2)) : 0,
      }))
      .sort((a: any, b: any) => b.wickets - a.wickets)
      .slice(0, 5);
  }
  calculateOrangeCap() {
    const batters = new Map();

    this.matches.forEach((match: any) => {
      match.teams.forEach((team: any) => {
        team.batting?.forEach((player: any) => {
          const playerId = player.id ?? player.playerId;

          if (!batters.has(playerId)) {
            batters.set(playerId, {
              name: player.name,
              runs: 0,
              balls: 0,
              matches: 0,
            });
          }

          const b = batters.get(playerId);

          b.runs += player.runs || 0;
          b.balls += player.balls || 0;
          b.matches += 1;
        });
      });
    });

    this.orangeCapList = Array.from(batters.values())
      .map((b: any) => ({
        ...b,
        strikeRate: b.balls > 0 ? Number(((b.runs * 100) / b.balls).toFixed(2)) : 0,
      }))
      .sort((a: any, b: any) => b.runs - a.runs)
      .slice(0, 5);
  }
}
