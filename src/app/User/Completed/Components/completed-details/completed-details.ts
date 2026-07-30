import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Match } from '../../Models/match-module';
import { CompletedService } from '../../Services/completed-service';

@Component({
  selector: 'app-completed-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-details.html',
  styleUrl: './completed-details.css',
})
export class CompletedDetails implements OnInit {
  private service = inject(CompletedService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cd = inject(ChangeDetectorRef);

  matches: Match[] = [];
  match: Match | null = null;
  selectedTab: 'summary' | 'scorecard' | 'blog' = 'summary';

  selectedTeamId: any = null;
  selectedTeam: any = null;
  bowlingTeam: any = null;
  relatedBlog: any = null;

  get blogImageUrl(): string {
    if (!this.relatedBlog || !this.relatedBlog.image) {
      return '';
    }

    if (this.relatedBlog.image.startsWith('http')) {
      return this.relatedBlog.image;
    }

    return `https://res.cloudinary.com/dde7fld9d/image/upload/f_auto,q_auto,w_1080/${this.relatedBlog.image}`;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const matchNo = Number(params['matchNo']);

      this.service.getMatch(matchNo).subscribe({
        next: (data) => {
          this.match = data;

          if (this.match?.teams && this.match.teams.length > 0) {
            this.selectInnings(this.match.teams[0].teamId);
          }

          this.fetchRelatedBlog();

          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load completed match:', err);
        },
      });
    });
  }

  selectMatch(selectedMatch: Match): void {
    this.match = selectedMatch;
    if (this.match?.teams && this.match.teams.length > 0) {
      this.selectInnings(this.match.teams[0].teamId);
    }

    this.fetchRelatedBlog();
  }

  private fetchRelatedBlog(): void {
    if (!this.match) return;

    this.http.get<any[]>('https://localhost:7144/api/Blog/').subscribe({
      next: (blogs) => {
        this.relatedBlog =
          blogs.find((blog) => Number(blog.matchId) === Number(this.match?.matchNo)) || null;

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Blog Fetch Error:', err);
      },
    });
  }

  openBlogDetails(): void {
    if (!this.relatedBlog) return;
    this.router.navigate(['/blog-detail/', this.relatedBlog.matchId]);
  }

  changeTab(tab: 'summary' | 'scorecard' | 'blog'): void {
    this.selectedTab = tab;
  }

  selectInnings(teamId: any): void {
    if (!this.match) return;

    this.selectedTeamId = teamId;
    this.selectedTeam = this.match.teams.find((t) => t.teamId === teamId);
    this.bowlingTeam = this.match.teams.find((t) => t.teamId !== teamId);
  }

  openScorecard(matchNo: number): void {
    this.router.navigate(['/completed', matchNo]);
  }

  isWinner(team: any): boolean {
    return team.matchStatus?.[0] ?? false;
  }

  getBowlingRecordsForTeam(currentTeam: any): any[] {
    if (!this.match) return [];
    const opposingTeam = this.match.teams.find((t) => t.teamId !== currentTeam.teamId);
    return opposingTeam ? opposingTeam.bowling : [];
  }

  getTopBatters(battingList: any[] | undefined): any[] {
    if (!battingList) return [];

    return [...battingList]
      .filter((player) => player.runs !== null && player.status !== 'Did Not Bat')
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);
  }

  getTopBowlers(bowlingList: any[] | undefined): any[] {
    if (!bowlingList) return [];

    return [...bowlingList]
      .filter((player) => player.overs !== null && player.overs !== '0.0')
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
      const batter = team.batting?.find((b) => b.name === potmName);
      if (batter && batter.runs !== null && batter.status !== 'Did Not Bat') {
        const notOutMark = batter.status === 'Not Out' ? '*' : '';
        return `${batter.runs}${notOutMark} (${batter.balls})`;
      }

      const bowler = team.bowling?.find((b) => b.name === potmName);
      if (bowler && bowler.overs) {
        return `${bowler.wickets}/${bowler.runsConceded} (${bowler.overs})`;
      }
    }

    return '';
  }
}
