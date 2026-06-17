import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Match } from '../../Completed/Models/match-module';
import { MatchData, Teams } from '../../UpCommingPage/match/match.models/match.models-module';
import { MatChipsModule } from '@angular/material/chips';
import { Team } from '../../LivePages/Models/models';
import { NavService } from './nav-service';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-nav',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDivider,
    MatChipsModule,
    MatButtonModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  items = [
    { label: 'Live', route: '/' },
    { label: 'Upcoming', route: '/upcoming' },
    { label: 'Completed', route: '/completed' },
    { label: 'Squads', route: '/squads' },
    { label: 'Points Table', route: '/points-table' },
    { label: 'Blog', route: '/blog' },
  ];
  router = inject(Router);
  service = inject(NavService);
  cd = inject(ChangeDetectorRef);

  activateRoute = '';

  getMethod(route: string) {
    this.activateRoute = route;
    this.router.navigateByUrl(route);
  }
  isNavbarVisible = true;
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.log('window scrolling');

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      this.isNavbarVisible = false;
    } else {
      this.isNavbarVisible = true;
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  selectedTeamId = 0;
  matchs: MatchData[] = [];
  filteredMatches: MatchData[] = [];
  teams: Teams[] = [];
  ngOnInit(): void {
    this.service.getData().subscribe((data: MatchData[]) => {
      this.matchs = data;

      const uniqueTeams: Teams[] = [];

      data.forEach((match) => {
        match.teams.forEach((team) => {
          const exists = uniqueTeams.some((t) => t.teamId === team.teamId);

          if (!exists) {
            uniqueTeams.push(team);
          }
        });
      });

      this.teams = uniqueTeams;
      this.cd.detectChanges();

      console.log('Teams:', this.teams);
    });
  }
  @Output() teamSelected = new EventEmitter<number>();
  matchFilter(teamId: number) {
    this.selectedTeamId = teamId;

    this.filteredMatches = this.matchs.filter((match) =>
      match.teams.some((team) => team.teamId === teamId),
    );
  }
}
