
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../quiz.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class LeaderBoard implements OnInit, OnDestroy {
  service = inject(QuizService);
  cd = inject(ChangeDetectorRef);
  router = inject(Router);

  allUsers: any[] = [];
  topFiveUsers: any[] = [];
  currentUserScore: any = null;
  currentUserName: string = '';
  loading: boolean = false;
  private isDataLoaded: boolean = false;
  private autoRefreshInterval: any;

  ngOnInit(): void {
    // Get current user name from localStorage or service
    this.currentUserName = localStorage.getItem('quizUserName') || '';
    this.loadLeaderboard();

    // Auto-refresh every 10 seconds while on leaderboard
    this.autoRefreshInterval = setInterval(() => {
      this.refreshLeaderboard();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.isDataLoaded = false;
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }

  loadLeaderboard(): void {
    if (this.loading || this.isDataLoaded) return;

    this.loading = true;

    this.service.getLeaderBoard().subscribe({
      next: (res: any[]) => {
        // Remove duplicates and sort
        this.allUsers = this.removeDuplicates(res);
        this.allUsers.sort((a, b) => b.score - a.score);

        // Get top 5
        this.topFiveUsers = this.allUsers.slice(0, 5);

        // Find current user
        this.findCurrentUser();

        this.isDataLoaded = true;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
        this.loading = false;
        this.cd.detectChanges();
      },
    });
  }

  private findCurrentUser(): void {
    if (!this.currentUserName) {
      // If no username stored, try to get from session
      this.currentUserName = localStorage.getItem('quizUserName') || '';
    }

    if (this.currentUserName) {
      this.currentUserScore = this.allUsers.find(
        (user) =>
          user.userName?.trim()?.toLowerCase() === this.currentUserName.trim().toLowerCase(),
      );
    }
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

  refreshLeaderboard(): void {
    this.isDataLoaded = false;
    this.loadLeaderboard();
  }

  getCurrentUserRank(): number {
    if (!this.currentUserScore) return 0;
    return (
      this.allUsers.findIndex(
        (user) =>
          user.userName?.trim()?.toLowerCase() === this.currentUserName.trim().toLowerCase(),
      ) + 1
    );
  }

  goToQuiz(): void {
    this.router.navigate(['/quiz']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
