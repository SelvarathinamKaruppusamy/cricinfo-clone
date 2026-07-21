import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../Models/match-module';

@Injectable({
  providedIn: 'root'
})
export class CompletedService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7144/api/completed';

  getCompletedMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getMatch(matchNo: number): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${matchNo}`);
  }
}