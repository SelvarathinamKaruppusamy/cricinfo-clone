import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Match } from '../../Models/match-module';
import { CompletedService } from '../../Services/completed-service';

@Component({
  selector: 'app-completed-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-details.html',
  styleUrl: './completed-details.css'
})
export class CompletedDetailsComponent implements OnInit {

  private service = inject(CompletedService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  matches: Match[] = [];
  match: Match | null = null; 

  selectedTab: 'summary' | 'scorecard' | 'commentary' = 'summary';
  selectedTeamId: any = null;
  selectedTeam: any = null;
  bowlingTeam: any = null;

  ngOnInit(): void {
    this.service.getCompletedMatches().subscribe({
      next: (data) => {
        this.matches = data;
        if (this.matches && this.matches.length > 0) {
          this.selectMatch(this.matches[0]);
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  selectMatch(selectedMatch: Match): void {
    this.match = selectedMatch;
    if (this.match?.teams && this.match.teams.length > 0) {
      this.selectInnings(this.match.teams[0].teamId);
    }
  }

  changeTab(tab: 'summary' | 'scorecard' | 'commentary'): void {
    this.selectedTab = tab;
  }

  selectInnings(teamId: any): void {
    if (!this.match) return;
    this.selectedTeamId = teamId;
    this.selectedTeam = this.match.teams.find(t => t.teamId === teamId);
    this.bowlingTeam = this.match.teams.find(t => t.teamId !== teamId);
  }

  openScorecard(matchNo: number): void {
    this.router.navigate(['/completed', matchNo]);
  }

  isWinner(team: any): boolean {
    return team.matchStatus?.[0] ?? false;
  }

  /**
   * Summary Tab Specific Logic: Extracts the opponent team's bowling list.
   * Ensures that when checking Team A's summary card block, we evaluate 
   * the bowlers from Team B who bowled against them.
   */
  getBowlingRecordsForTeam(currentTeam: any): any[] {
    if (!this.match) return [];
    const opposingTeam = this.match.teams.find(t => t.teamId !== currentTeam.teamId);
    return opposingTeam ? opposingTeam.bowling : [];
  }

  /**
   * Summary performance logic: Filters out un-utilized batters,
   * sorts descending by runs scored, and returns top 3.
   */
  getTopBatters(battingList: any[] | undefined): any[] {
    if (!battingList) return [];
    return [...battingList]
      .filter(player => player.runs !== null && player.status !== 'Did Not Bat')
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);
  }

  /**
   * Summary performance logic: Filters out un-utilized bowlers,
   * sorts descending by wickets, applies a low runs-conceded tiebreaker,
   * and returns top 3.
   */
  getTopBowlers(bowlingList: any[] | undefined): any[] {
    if (!bowlingList) return [];
    return [...bowlingList]
      .filter(player => player.overs !== null && player.overs !== '0.0')
      .sort((a, b) => {
        if (b.wickets !== a.wickets) {
          return b.wickets - a.wickets;
        }
        return a.runsConceded - b.runsConceded;
      })
      .slice(0, 3);
  }

  /**
   * Tracks down Player of the Match records inside innings lists to
   * construct the banner card statistic label text dynamically.
   */
  getPotmStats(): string {
    if (!this.match || !this.match.playerOfTheMatch) return '';
    const potmName = this.match.playerOfTheMatch;

    for (const team of this.match.teams) {
      const batter = team.batting?.find(b => b.name === potmName);
      if (batter && batter.runs !== null && batter.status !== 'Did Not Bat') {
        const notOutMark = batter.status === 'Not Out' ? '*' : '';
        return `${batter.runs}${notOutMark} (${batter.balls})`;
      }

      const bowler = team.bowling?.find(b => b.name === potmName);
      if (bowler && bowler.overs) {
        return `${bowler.wickets}/${bowler.runsConceded} (${bowler.overs})`;
      }
    }
    return '';
  }
}