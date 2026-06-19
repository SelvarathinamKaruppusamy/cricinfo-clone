import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UpcService } from './upc-service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

interface Team {
  teamId: number;
  shortName: string;
  fullName: string;
  logo?: string;
}

interface Match {
  id: number;
  status: string;
  matchNo: number;
  city: string;
  venue: string;
  date: string;
  teams: Team[];
}

export interface matchCard {
  id: number;
  status: string;
  matchNo: number;
  city: string;
  stadium: string;
  team1: Team;
  team2: Team;
  time: string;
  date: string;
}

@Component({
  selector: 'app-up-comp',
  imports: [CommonModule,RouterOutlet],
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
    this.service.getMatch().subscribe((matches) => {
      this.cards = matches.map((match: Match) => ({
        id: match.id,
        status: match.status,
        matchNo: match.matchNo,
        city: match.city,
        stadium: match.venue,
        team1: match.teams[0],
        team2: match.teams[1],
        time: '7:30 PM ',
        date: match.date,
      }));
      this.service.upCommingdata=this.cards[0]
      this.cd.detectChanges();
      
    });
  }
  open(id: number) {
    this.router.navigate(['/match', id]);
  }
formatDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
schedulepage(event: Event, id: number) {
    event.stopPropagation();
    this.router.navigate(['/schedule', id]);
  }
}
