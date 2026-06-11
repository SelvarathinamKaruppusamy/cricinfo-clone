import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private http = inject(HttpClient);

  getData() {
    return this.http.get<any[]>('http://localhost:3000/matches');
  }
}
