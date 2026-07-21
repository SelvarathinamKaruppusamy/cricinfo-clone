import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pointstable {
  private apiUrl =
    'https://localhost:7144/api/PointsTable';

  constructor(private http: HttpClient) {}
getLatestPointsTable(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`);
}
  getPointsTable(
    matchNo: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/${matchNo}`
    );
  }
}
