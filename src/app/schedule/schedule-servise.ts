import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScheduleServise {
  constructor(private http: HttpClient) {}

  getLiveMatches() {
    return this.http.get<any[]>('http://localhost:3000/matches');
  }

  getUpcomingMatches() {
    return this.http.get<any[]>('http://localhost:5000/matches');
  }

  getCompletedMatches() {
    return this.http.get<any[]>('http://localhost:7000/completed');
  }
}
