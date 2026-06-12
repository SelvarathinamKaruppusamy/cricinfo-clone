import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Match } from '../Models/match-module';

@Injectable({
  providedIn: 'root',
})
export class CompletedService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:7000/completed';

  getCompletedMatches() {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatch(matchNo: number) {
    return this.http.get<Match[]>(`${this.apiUrl}?matchNo=${matchNo}`);
  }
}
