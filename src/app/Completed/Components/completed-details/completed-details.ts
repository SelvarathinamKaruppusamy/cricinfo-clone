// import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';

// import { Match } from '../../Models/match-module';
// import { CompletedService } from '../../Services/completed-service';

// @Component({
//   selector: 'app-completed-details',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './completed-details.html',
//   styleUrl: './completed-details.css'
// })
// export class CompletedDetailsComponent implements OnInit {

//   private route = inject(ActivatedRoute);
//   private service = inject(CompletedService);
//   private cd=inject(ChangeDetectorRef)

//   match!: Match;

//   selectedTab = 'summary';

//   ngOnInit(): void {

//     const matchNo = Number(
//       this.route.snapshot.paramMap.get('matchNo')
//     );

//     // this.service.getMatch(matchNo).subscribe({
//     //   next: (data) => {
//     //     if (data) {
//     //       this.match = data;
//     //       this.cd.detectChanges()
//     //       console.log(this.match)
//     //     }

//     //   },
//     //   error: (err) => {
//     //     console.error(err);
//     //   }
//     // });
//     this.service.getMatch(matchNo).subscribe({
//   next: (data) => {

//     if (data.length > 0) {
//       this.match = data[0];
//     }

//   },
//   error: (err) => {
//     console.error(err);
//   }
// });

//   }
  

//   changeTab(tab: string): void {
//     this.selectedTab = tab;
//   }
// }
// completed-details.component.ts
// completed-details.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Match, Team } from '../../Models/match-module';
import { CompletedService } from '../../Services/completed-service';

@Component({
  selector: 'app-completed-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-details.html',
  styleUrl: './completed-details.css'
})
export class CompletedDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CompletedService);
  private cd = inject(ChangeDetectorRef);

  match: Match | null = null;
  selectedTab = 'summary';
  selectedTeamId = 0;

  ngOnInit(): void {
    const matchNo = Number(this.route.snapshot.paramMap.get('matchNo'));

    this.service.getMatch(matchNo).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.match = data[0];
          // Set default selected team to first team
          if (this.match && this.match.teams && this.match.teams.length > 0) {
            this.selectedTeamId = this.match.teams[0].teamId;
          }
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading match:', err);
      }
    });
  }

  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  selectInnings(teamId: number): void {
    this.selectedTeamId = teamId;
  }

  get selectedTeam(): Team | undefined {
    return this.match?.teams.find(t => t.teamId === this.selectedTeamId);
  }

  get bowlingTeam(): Team | undefined {
    return this.match?.teams.find(t => t.teamId !== this.selectedTeamId);
  }
}