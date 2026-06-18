import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  Math: any;

  constructor(
    private completedService: CompletedService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const matchNo = Number(params.get('matchNo'));
      this.loadPointsTable(matchNo);
    });
  }

  loadPointsTable(selectedMatchNo?: number): void {
    this.completedService.getCompletedMatches().subscribe({
      next: (matches: any[]) => {
        let filteredMatches = matches;

        if (selectedMatchNo) {
          filteredMatches = matches.filter((match) => match.matchNo <= selectedMatchNo);
        }

        const teamMap = new Map<number, any>();

        matches.forEach((match: any) => {
          match.teams.forEach((team: any) => {
            if (!teamMap.has(team.teamId)) {
              teamMap.set(team.teamId, {
                teamId: team.teamId,
                logo: team.logo,
                name: team.shortName,

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
          });
        });

        filteredMatches.forEach((match: any) => {
          const team1 = match.teams[0];
          const team2 = match.teams[1];

          [team1, team2].forEach((currentTeam: any) => {
            const team = teamMap.get(currentTeam.teamId);

            team.played = currentTeam.totalMatch;
            team.wins = currentTeam.winCount;
            team.losses = currentTeam.lossCount;
            team.points = currentTeam.winCount * 2;
            team.form = currentTeam.matchStatus ?? [];
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
          const runRateFor = team.ballsFaced > 0 ? team.runsScored / (team.ballsFaced / 6) : 0;

          const runRateAgainst =
            team.ballsBowled > 0 ? team.runsConceded / (team.ballsBowled / 6) : 0;

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
        console.error('Error loading points table:', err);
      },
    });
  }
}
