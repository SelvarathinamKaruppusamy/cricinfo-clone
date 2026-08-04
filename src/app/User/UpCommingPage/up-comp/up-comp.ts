import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UpcService } from './upc-service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { interval, startWith, switchMap } from 'rxjs';
interface Team {
  teamId: number;
  shortName: string;
  fullName: string;
  logo?: string;
}

interface Match {
  status: string;
  matchNo: string;
  city: string;
  venue: string;
  date: string;
  teams: Team[];
}

export interface matchCard {
  matchNo: string;
  status: string;
  city: string;
  stadium: string;
  team1: Team;
  team2: Team;
  time: string;
  date: string;
}

@Component({
  selector: 'app-up-comp',
  imports: [
    CommonModule,
    //  RouterOutlet,
    MatButtonModule,
  ],
  templateUrl: './up-comp.html',
  styleUrl: './up-comp.css',
  standalone: true,
})
export class UpComp {
  cards: matchCard[] = [];

  service = inject(UpcService);
  cd = inject(ChangeDetectorRef);
  router = inject(Router);

  ngOnInit() {

    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.service.getMatch()),
      )
      .subscribe((matches) => {
     this.cards = matches.map(match => ({
  matchNo: match.matchNo,
  status: match.status,
  city: match.city,
  stadium: match.venue,
  team1: match.teams[0],
  team2: match.teams[1],
  time: '7:30 PM',
  date: match.date,
}));
        // this.service.updateMatch = this.cards[0];
        this.cd.detectChanges();
      });
  }
  open(matchNo:string) {
    this.router.navigate(['/match', matchNo]);
  }
  formatDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  schedulepage(event: Event, matchNo:string) {
    event.stopPropagation();
    this.router.navigate(['/schedule', matchNo]);
  }
}
