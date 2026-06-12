import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CompletedService } from '../Completed/Services/completed-service';

@Component({
  selector: 'app-points-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './points-table.html',
  styleUrl: './points-table.css',
})
export class PointsTable implements OnInit {
  pointsTable: any[] = [];

  constructor(
    private completedService: CompletedService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPointsTable();
  }

  loadPointsTable(): void {
    this.completedService.getCompletedMatches().subscribe({
      next: (matches: any[]) => {
        const teamMap = new Map<number, any>();

        matches.forEach((match: any) => {
          const team1 = match.teams[0];
          const team2 = match.teams[1];

          [team1, team2].forEach((currentTeam: any) => {
            if (!teamMap.has(currentTeam.teamId)) {
              teamMap.set(currentTeam.teamId, {
                teamId: currentTeam.teamId,
                logo: currentTeam.logo,
                name: currentTeam.shortName,

                played: 0,
                wins: 0,
                losses: 0,
                points: 0,

                runsScored: 0,
                ballsFaced: 0,

                runsConceded: 0,
                ballsBowled: 0,

                nrr: 0,

                form: [],
              });
            }

            const team = teamMap.get(currentTeam.teamId);

            team.played = currentTeam.totalMatch;
            team.wins = currentTeam.winCount;
            team.losses = currentTeam.lossCount;
            team.points = currentTeam.winCount * 2;

            // Latest occurrence wins
            team.form = currentTeam.matchStatus;
          });

          const firstTeam = teamMap.get(team1.teamId);
          const secondTeam = teamMap.get(team2.teamId);

          firstTeam.runsScored += team1.runs;
          firstTeam.ballsFaced += team1.balls;
          firstTeam.runsConceded += team2.runs;
          firstTeam.ballsBowled += team2.balls;

          secondTeam.runsScored += team2.runs;
          secondTeam.ballsFaced += team2.balls;
          secondTeam.runsConceded += team1.runs;
          secondTeam.ballsBowled += team1.balls;
        });

        this.pointsTable = [...teamMap.values()];

        this.pointsTable.forEach((team) => {
          const runRateFor = team.runsScored / (team.ballsFaced / 6);

          const runRateAgainst = team.runsConceded / (team.ballsBowled / 6);

          team.nrr = +(runRateFor - runRateAgainst).toFixed(3);
        });

        this.pointsTable.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }

          return b.nrr - a.nrr;
        });

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
