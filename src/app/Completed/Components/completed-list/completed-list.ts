import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
 
import { Match } from '../../Models/match-module';
import { CompletedService } from '../../Services/completed-service';
import { Schedule } from '../../../schedule/schedule';
 
@Component({
  selector: 'app-completed-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: 'completed-list.html',
  styleUrl: 'completed-list.css',
})
export class CompletedList implements OnInit {
  private service = inject(CompletedService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
 
  matches: Match[] = [];
  match: Match | null = null;
 
  selectedTab: 'summary' | 'scorecard' | 'commentary' = 'summary';
  selectedTeamId: any = null;
  selectedTeam: any = null;
  bowlingTeam: any = null;
 
  ngOnInit(): void {
    const matchNo = Number(this.route.snapshot.paramMap.get('matchNo'));
 
    this.service.getCompletedMatches().subscribe({
      next: (data) => {
        this.matches = data;
 
        const selectedMatch = this.matches.find(
          (match) => Number(match.matchNo) === matchNo
        );
 
        if (selectedMatch) {
          this.selectMatch(selectedMatch);
        }
 
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
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
 
    this.selectedTeam = this.match.teams.find(
      (t) => t.teamId === teamId
    );
 
    this.bowlingTeam = this.match.teams.find(
      (t) => t.teamId !== teamId
    );
  }
 
  openScorecard(matchNo: number): void {
    this.router.navigate(['/completed', matchNo]);
  }
 
  openPointsTable(matchNo: number): void {
    this.router.navigate(['/points-table', matchNo]);
  }
 
  isWinner(team: any): boolean {
    return team.matchStatus?.[0] ?? false;
  }
 
  getBowlingRecordsForTeam(currentTeam: any): any[] {
    if (!this.match) return [];
 
    const opposingTeam = this.match.teams.find(
      (t) => t.teamId !== currentTeam.teamId
    );
 
    return opposingTeam ? opposingTeam.bowling : [];
  }
 
  getTopBatters(battingList: any[] | undefined): any[] {
    if (!battingList) return [];
 
    return [...battingList]
      .filter(
        (player) =>
          player.runs !== null &&
          player.status !== 'Did Not Bat'
      )
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);
  }
 
  getTopBowlers(bowlingList: any[] | undefined): any[] {
    if (!bowlingList) return [];
 
    return [...bowlingList]
      .filter(
        (player) =>
          player.overs !== null &&
          player.overs !== '0.0'
      )
      .sort((a, b) => {
        if (b.wickets !== a.wickets) {
          return b.wickets - a.wickets;
        }
 
        return a.runsConceded - b.runsConceded;
      })
      .slice(0, 3);
  }
 
  getPotmStats(): string {
    if (!this.match || !this.match.playerOfTheMatch) {
      return '';
    }
 
    const potmName = this.match.playerOfTheMatch;
 
    for (const team of this.match.teams) {
      const batter = team.batting?.find(
        (b) => b.name === potmName
      );
 
      if (
        batter &&
        batter.runs !== null &&
        batter.status !== 'Did Not Bat'
      ) {
        const notOutMark =
          batter.status === 'Not Out' ? '*' : '';
 
        return `${batter.runs}${notOutMark} (${batter.balls})`;
      }
 
      const bowler = team.bowling?.find(
        (b) => b.name === potmName
      );
 
      if (bowler && bowler.overs) {
        return `${bowler.wickets}/${bowler.runsConceded} (${bowler.overs})`;
      }
    }
 
    return '';
  }
  schedulepage(id:number){
    this.router.navigate(['/schedule',id])
  }
 
}
