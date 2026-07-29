import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LiveModel } from "../../User/LivePages/Models/models";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly apiUrl = 'https://localhost:7144/api/live';

  http = inject(HttpClient);

  GetUpcomingMatches(): Observable<LiveModel[]> {
    return this.http.get<LiveModel[]>(
      `${this.apiUrl}/upcoming`
    );
  }

  CompleteMatch(body: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/complete-match`,
      body
    );
  }

  PromoteUpcomingMatch(matchNo: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/promote/${matchNo}`,
      {}
    );
  }

}