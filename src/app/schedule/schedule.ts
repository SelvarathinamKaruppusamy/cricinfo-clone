import { Component, OnInit } from '@angular/core';
import { ScheduleServise } from './schedule-servise';
import { CommonModule } from '@angular/common';

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

  constructor(private service: ScheduleServise) {}

  ngOnInit() {
    this.service.getLiveMatches().subscribe((data) => {
      this.live = data.map(this.mapMatch);
    });

    this.service.getUpcomingMatches().subscribe((data) => {
      this.upcoming = data.map(this.mapMatch);
    });

    this.service.getCompletedMatches().subscribe((data) => {
      this.completed = data.map(this.mapMatch);
    });
  }

  selectedMatchId: number | null = null;

  selectMatch(id: number): void {
    this.selectedMatchId = id;
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
}
