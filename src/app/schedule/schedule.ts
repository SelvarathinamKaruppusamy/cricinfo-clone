import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ScheduleServise } from './schedule-servise';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UpcService } from '../UpCommingPage/up-comp/upc-service';
import { LiveService } from '../LivePages/Services/live-service';
import { CompletedService } from '../Completed/Services/completed-service';

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
  constructor(private service: ScheduleServise) {}

  ngOnInit() {
    this.liveservice.GetLiveMatches().subscribe((data) => {
      this.live = data.map(this.mapMatch);
      setTimeout(() => {
      this.scrollToSelectedMatch();
    });
       this.cd.detectChanges()
    });
    this.upservice.getMatch().subscribe((data) => {
      this.upcoming = data.map(this.mapMatch);
      setTimeout(() => {
      this.scrollToSelectedMatch();
    });
      this.cd.detectChanges()
    });
    this.completedservice.getCompletedMatches().subscribe((data) => {
      this.completed = data.map(this.mapMatch);
      setTimeout(() => {
      this.scrollToSelectedMatch();
    });
      this.cd.detectChanges()
    });
    this.route.params.subscribe((res)=>{
      this.selectedMatchId=Number(res['id']);
      setTimeout(() => {
      this.scrollToSelectedMatch();
    });
    })
    this.cd.detectChanges()
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
