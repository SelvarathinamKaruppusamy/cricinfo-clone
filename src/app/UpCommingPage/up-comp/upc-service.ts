import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchData } from '../match/match.models/match.models-module';

@Injectable({
  providedIn: 'root',
})
export class UpcService {
  http = inject(HttpClient);

  getMatch() {
    return this.http.get<any[]>('http://localhost:5000/matches');
  }

  getMatchById(id: string) {
    return this.http.get<MatchData>(`http://localhost:5000/matches/${id}`);
  }
}
