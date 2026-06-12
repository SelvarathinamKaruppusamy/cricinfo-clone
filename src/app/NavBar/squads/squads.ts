import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NavService } from '../nav/nav-service';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

interface player {
  playerId: number;
  name: string;
  role: string;
}

interface Team {
  teamId: number;
  shortName: string;
  fullName: string;
  players: player[];
  logo: string;
}

interface Match {
  matchId: number;
  teams: Team[];
}
@Component({
  selector: 'app-squads',
  imports: [
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatListModule,
  ],
  templateUrl: './squads.html',
  styleUrl: './squads.css',
  standalone: true,
})
export class Squads {
  private ser = inject(NavService);
  private cd = inject(ChangeDetectorRef);

  teams: Team[] = [];
  selectedTeam: Team | null = null;

  ngOnInit() {
    this.ser.getData().subscribe((data: Match[]) => {
      console.log(data);
      const unique = new Map();
      data.forEach((match: Match) => {
        match.teams.forEach((team: any) => {
          if (!unique.has(team.teamId)) {
            unique.set(team.teamId, team);
          }
        });
      });
      this.teams = Array.from(unique.values());
      this.cd.detectChanges();
    });
  }
  selectTeam(team: Team) {
    this.selectedTeam = team;
  }
}
