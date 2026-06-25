import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchData, updateMatch } from '../match/match.models/match.models-module';
import { matchCard } from './up-comp';

@Injectable({
  providedIn: 'root',
})
export class UpcService {
  http = inject(HttpClient);
  upcommingdata!:matchCard
  upCommingdata!:matchCard
  getMatch() {
    return this.http.get<any[]>('http://localhost:5000/matches');
  }
  getMatchById(id: string) {
    return this.http.get<MatchData>(`http://localhost:5000/matches/${id}`);
  }

  updateMatch(id:string,match:updateMatch){
    return this.http.put<updateMatch>(`http://localhost:5000/matches/${id}`,match);
  }

}
