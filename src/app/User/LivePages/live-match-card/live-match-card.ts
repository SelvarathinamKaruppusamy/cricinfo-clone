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
import { catchError, EMPTY, filter } from 'rxjs';
import { AdminService } from '../../../Admin/LiveAdmin/admin-service';

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
  this.intervalId = setInterval(() => {
    this.reloadLandingData();

    // stop interval if live match is completed
    if (this.live?.status === 'COMPLETED') {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Polling stopped - match completed');
    }
  }, 1000);

  this.route.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.reloadLandingData();
    });
}

  reloadLandingData() {
    this.loadLiveMatch();
    this.loadUpcomingMatch();
    this.loadCompletedMatches();
  }

  loadLiveMatch() {
    this.service
      .GetLiveMatches()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (!res?.length) return;

        this.live = res[0];
        this.service.live.set(this.live);
        this.team1 = this.live.teams[0];
        this.team2 = this.live.teams[1];

        this.changedetector.detectChanges();
      });
  }

  loadUpcomingMatch() {
    this.upservice
      .getMatch()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        if (!res?.length) {
          return;
        }

        this.upcommingdata = res[0];
        this.upteam1 = this.upcommingdata.teams[0];
        this.upteam2 = this.upcommingdata.teams[1];

        this.changedetector.detectChanges();
      });
  }

  loadCompletedMatches() {
    this.comservice
      .getCompletedMatches()
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        // Landing page last 5 completed
        this.completeddata = res.slice(-5).reverse();

        // Full reversed list for filter cards
        this.matchs = [...res].reverse();

        const uniqueTeams: Teams[] = [];
        this.matchs.forEach((match) => {
          match.teams.forEach((team) => {
            const exists = uniqueTeams.some((t) => t.teamId === team.teamId);
            if (!exists) {
              uniqueTeams.push(team);
              this.changedetector.detectChanges()
            }
          });
        });

        this.teams = uniqueTeams;
        console.log(this.teams)
        this.changedetector.detectChanges();
        console.log(this.teams)
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
}