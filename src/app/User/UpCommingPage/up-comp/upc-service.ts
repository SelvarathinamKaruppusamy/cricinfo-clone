import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchData, updateMatch } from '../match/match.models/match.models-module';
import { matchCard } from './up-comp';
import { LiveModel } from '../../LivePages/Models/models';

@Injectable({
  providedIn: 'root',
})
export class UpcService {
  http = inject(HttpClient);

  private apiUrl = 'https://localhost:7144/api/Upcoming';

  getMatch() {
    return this.http.get<updateMatch[]>(this.apiUrl);
  }
  getUpcomingMatches() {
  return this.http.get<LiveModel[]>(
    'https://localhost:7144/api/Upcoming'
  );
}

  getMatchById(matchNo: string) {
  return this.http.get<MatchData>(`${this.apiUrl}/${matchNo}`);
}

updateMatch(matchNo: string, match: updateMatch) {
  return this.http.put(`${this.apiUrl}/${matchNo}`, match);
}
}