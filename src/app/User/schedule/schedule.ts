import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UpcService } from '../UpCommingPage/up-comp/upc-service';
import { LiveService } from '../LivePages/Services/live-service';
import { CompletedService } from '../Completed/Services/completed-service';
import { LiveModel } from '../LivePages/Models/models';

interface MatchCard {
  id: number;
  status: string;
  matchNo: number;
  city: string;
  stadium: string;
  team1: any;
  team2: any;
  time: string;
  date: any; 
  result: string;
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule implements OnInit {
  live: MatchCard[] = [];
  upcoming: MatchCard[] = [];
  completed: MatchCard[] = [];
  cd=inject(ChangeDetectorRef)
  selectedMatchId: number | null = null;
  route=inject(ActivatedRoute)
  upservice=inject(UpcService)
  liveservice=inject(LiveService)
  completedservice=inject(CompletedService)

  ngOnInit() {

  // Live Match
  this.liveservice.GetLiveMatch().subscribe({

    next: (match: LiveModel) => {

      this.live = [this.mapMatch(match)];

      setTimeout(() => {
        this.scrollToSelectedMatch();
      });

      this.cd.detectChanges();

    },

    error: (err) => console.error(err)

  });

  // Upcoming Matches
  this.upservice.getMatch().subscribe({

    next: (data) => {

      this.upcoming = data.map(this.mapMatch);

      setTimeout(() => {
        this.scrollToSelectedMatch();
      });

      this.cd.detectChanges();

    },

    error: (err) => console.error(err)

  });

  // Completed Matches
  this.completedservice.getCompletedMatches().subscribe({

    next: (data) => {

      this.completed = data.map(this.mapMatch);

      setTimeout(() => {
        this.scrollToSelectedMatch();
      });

      this.cd.detectChanges();

    },

    error: (err) => console.error(err)

  });

  // Route Parameter
  this.route.params.subscribe(params => {

    this.selectedMatchId = Number(params['id']);

    setTimeout(() => {
      this.scrollToSelectedMatch();
    });

  });

}
  mapMatch(match: any): MatchCard {
    return {
      id: match.id,
      status: match.status,
      matchNo: match.matchNo,
      city: match.city,
      stadium: match.venue,
      team1: match.teams?.[0]
        ? {
            ...match.teams[0],
            score: match.teams[0].scores, 
            overs: match.teams[0].overs, 
          }
        : null,
      team2: match.teams?.[1]
        ? {
            ...match.teams[1],
            score: match.teams[1].scores, 
            overs: match.teams[1].overs, 
          }
        : null,
      time: '7:30 PM',
      date: match.date,
      result: match.result || '',
    };
  }
  scrollToSelectedMatch() {
  if (!this.selectedMatchId) return;

  const element = document.getElementById(
    `match-${this.selectedMatchId}`
  );

  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}
}
