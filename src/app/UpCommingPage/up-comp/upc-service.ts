import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpcService {
  constructor(private http: HttpClient) {
    console.log('UpComp Loaded');
  }

  getMatch() {
    return this.http.get<any[]>('http://localhost:5000/matches');
  }

  getMatchById(id: string) {
    return this.http.get(`http://localhost:5000/matches/${id}`);
  }
}
