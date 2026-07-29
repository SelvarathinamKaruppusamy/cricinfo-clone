import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  http = inject(HttpClient);
  api = 'https://localhost:7144/api/quiz';

  // Cache for leaderboard data
  lastResult: { userName: string; score: number } | null = null;
  private leaderboardCache: any[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 60000; // 1 minute

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  submitQuiz(data: any): Observable<number> {
    // Clear cache when new quiz is submitted
    this.clearLeaderboardCache();
    return this.http.post<number>(this.api, data);
  }

  getLeaderBoard(): Observable<any[]> {
    // Check if we have valid cache
    if (this.leaderboardCache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      // Return cached data as Observable - ensure we return a valid array
      return of(this.leaderboardCache); // Use 'of' instead of creating new Observable
    }

    // Fetch new data and cache it
    return this.http.get<any[]>(`${this.api}/leaderboard`).pipe(
      tap((data) => {
        // Remove duplicates before caching
        this.leaderboardCache = this.removeDuplicates(data);
        this.cacheTimestamp = Date.now();
      }),
      shareReplay(1), // Share the response with multiple subscribers
    );
  }

  clearLeaderboardCache(): void {
    this.leaderboardCache = null;
    this.cacheTimestamp = 0;
  }

  private removeDuplicates(data: any[]): any[] {
    const seen = new Set();
    return data.filter((item) => {
      const key = `${item.userName?.trim()?.toLowerCase()}-${item.score}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
