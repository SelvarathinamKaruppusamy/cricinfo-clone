import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Match } from '../../Models/match-module';
import { CompletedService } from '../../Services/completed-service';

@Component({
  selector: 'app-completed-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-list.html',
  styleUrl: './completed-list.css'
})
export class CompletedListComponent implements OnInit {

  private service = inject(CompletedService);
  private router = inject(Router);
 private cd=inject(ChangeDetectorRef);
  matches: Match[] = [];

  ngOnInit(): void {

    this.service.getCompletedMatches().subscribe({
      next: (data) => {
        this.matches = data;
        this.cd.detectChanges()
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  openScorecard(matchNo: number): void {
    this.router.navigate(['/completed', matchNo]);
  }

  isWinner(team: any): boolean {
    return team.matchStatus?.[0] ?? false;
  }

}