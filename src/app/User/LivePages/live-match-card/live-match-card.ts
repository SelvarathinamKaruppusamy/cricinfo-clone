import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { LiveService } from '../Services/live-service';
import { LiveModel, Team } from '../Models/models';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UpcService } from '../../UpCommingPage/up-comp/upc-service';
import { CompletedService } from '../../Completed/Services/completed-service';
import { Match } from '../../Completed/Models/match-module';
import { ElementRef, ViewChild } from '@angular/core';
import { AdCoverupPage } from '../ad-coverup-page/ad-coverup-page';
import { Teams } from '../../UpCommingPage/match/match.models/match.models-module';
import { MatDivider } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../Admin/LiveAdmin/admin-service';
import {
  catchError,
  EMPTY,
  filter,
  timer,
  switchMap,
  Subject,
  takeUntil,
  forkJoin,
  of,
} from 'rxjs';
@Component({
  selector: 'app-live-match-card',
  imports: [
    MatIconModule,
    CommonModule,
    MatCardModule,
    RouterOutlet,
    AdCoverupPage,
    MatDivider,
    MatChipsModule,
    RouterLink,
  ],
  templateUrl: './live-match-card.html',
  styleUrl: './live-match-card.css',
})
export class LiveMatchCard implements OnInit {
  @ViewChild('cardContainer')
  cardContainer!: ElementRef<HTMLDivElement>;
private destroy$ = new Subject<void>();
  live!: LiveModel;
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  upservice = inject(UpcService);
  route = inject(Router);
  comservice = inject(CompletedService);
  adminService = inject(AdminService);

  team1!: Team;
  team2!: Team;
  upteam1!: Team;
  upteam2!: Team;

  target = 0;
  requiredRuns = 0;
  remainingBalls = 120;
  totalBalls = 120;

  upcommingdata!: LiveModel;
  completeddata: Match[] = [];

  teams: Teams[] = [];
  selectedTeamId = 0;
  matchs: Match[] = [];
  filteredMatches: Match[] = [];

  trackflag = true;
  trackflag1 = true;
  intervalId:any

  constructor() {
    effect(() => {
      this.service.ball(); // optional trigger
      const live = this.service.live();
      if (!live) return;

      this.live = live;
      this.team1 = live.teams[0];
      this.team2 = live.teams[1];
      
      this.requiredRun();
      this.changedetector.detectChanges();
    });
  }

 ngOnInit(): void {
  // Poll Live Match every second
 timer(0, 1000)
  .pipe(
    switchMap(() =>
      forkJoin({
        live: this.service.GetLiveMatches().pipe(
          catchError(() => of([]))
        ),
        upcoming: this.upservice.getMatch().pipe(
          catchError(() => of([]))
        ),
        completed: this.comservice.getCompletedMatches().pipe(
          catchError(() => of([]))
        )
      })
    ),
    takeUntil(this.destroy$)
  )
  .subscribe(({ live, upcoming, completed }) => {

    // ---------------- LIVE ----------------

    if (live.length) {

      this.live = live[0];
      this.team1 = this.live.teams[0];
      this.team2 = this.live.teams[1];

      this.service.live.set(this.live);
      this.requiredRun();

    } else {

      this.live = null as any;
      this.team1 = null as any;
      this.team2 = null as any;

      this.service.live.set(null);
    }

    // ---------------- UPCOMING ----------------

    if (upcoming.length) {

      this.upcommingdata = upcoming[0];
      this.upteam1 = this.upcommingdata.teams[0];
      this.upteam2 = this.upcommingdata.teams[1];

    } else {

      this.upcommingdata = null as any;
      this.upteam1 = null as any;
      this.upteam2 = null as any;
    }

    // ---------------- COMPLETED ----------------
this.completeddata = completed.slice(-5).reverse();

this.matchs = [...completed].reverse();

const uniqueTeams: Teams[] = [];

for (const match of this.matchs) {
  for (const team of match.teams) {
    if (!uniqueTeams.find(t => t.teamId === team.teamId)) {
      uniqueTeams.push(team);
    }
  }
}

this.teams = uniqueTeams;

    this.changedetector.detectChanges();

  });
}
  requiredRun() {
    const live = this.service.live();
    if (!live) return;

    if (this.service.innings() !== 2) {
      this.target = 0;
      this.requiredRuns = 0;
      this.remainingBalls = 0;
      return;
    }

    this.target = (this.service.completedBattingTeam?.scores ?? 0) + 1;

    const battingIndex = this.service.currentBattingTeam();
    const battingTeam = live.teams[battingIndex];

    this.requiredRuns = this.target - battingTeam.scores;

    const overs = battingTeam.overs ?? 0;
    const fullOvers = Math.floor(overs);
    const ballsPart = Math.round((overs % 1) * 10);
    const ballsBowled = fullOvers * 6 + ballsPart;

    this.remainingBalls = this.totalBalls - ballsBowled;
  }

  matchFilter(teamId: number) {
    this.selectedTeamId = teamId;
    this.filteredMatches = this.matchs.filter((match) =>
      match.teams.some((team) => team.teamId === teamId)
    );
  }

  changebutton() {
    this.trackflag = true;
    this.trackflag1 = true;
    this.selectedTeamId = 0;
  }

  changebutton1() {
    this.trackflag1 = true;
    this.trackflag = false;
  }

  scrollLeft() {
    this.cardContainer.nativeElement.scrollBy({
      left: -370,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.cardContainer.nativeElement.scrollBy({
      left: 370,
      behavior: 'smooth',
    });
  }

  movetolivepage() {
    this.trackflag1 = false;
    this.route.navigateByUrl('/live/livepage');
  }

  movetoupcommingpage() {
    this.trackflag1 = false;
    this.route.navigateByUrl(`/live/match/${this.upcommingdata.id}`);
  }

  completedpage(matchNo: number): void {
    this.trackflag1 = false;
    this.route.navigate(['/live/completed', matchNo]);
  }

  table(event: Event, id: number) {
    event.stopPropagation();
    this.trackflag1 = false;
    this.route.navigate(['/live/points-table', id]);
  }

  schedulepage(event: Event, id: number) {
    event.stopPropagation();
    this.trackflag1 = false;
    this.route.navigate(['/live/schedule', id]);
    this.changedetector.detectChanges();
  }
  ngOnDestroy(): void {

  this.destroy$.next();
  this.destroy$.complete();

}
}