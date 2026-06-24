import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { LiveService } from '../../LivePages/Services/live-service';
import { LiveModel, Player } from '../../LivePages/Models/models';
import { AdminService } from '../admin-service';

@Component({
  selector: 'app-completed-update-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule],
  templateUrl: './completed-update-admin.html',
  styleUrl: './completed-update-admin.css',
})
export class CompletedUpdateAdmin implements OnInit {
  liveService = inject(LiveService);
  transitionService = inject(AdminService);

  live = computed(() => this.liveService.live());
  upcomingPreview = signal<LiveModel | null>(null);

  resultText = '';
  playerOfMatch = '';

  allPlayers = computed<Player[]>(() => {
    const live = this.live();
    if (!live) return [];
    return [...live.teams[0].players, ...live.teams[1].players];
  });

  ngOnInit(): void {
    if (!this.liveService.live()) {
      this.liveService.GetLiveMatches().subscribe((res) => {
        if (res?.length) {
          this.liveService.loadMatchIntoService(res[0]);
        }
      });
    }

    this.transitionService.GetUpcomingMatches().subscribe((res) => {
      this.upcomingPreview.set(res?.length ? res[0] : null);
    });
  }

  autoGenerateResult() {
    const live = this.live();
    if (!live) return;
    this.resultText = this.transitionService.generateResultFromScores(live);
  }

  completeMatch() {
    if (!this.playerOfMatch.trim()) {
      alert('Select player of the match');
      return;
    }

    const ok = confirm(
      `Complete this match?\n\nResult: ${this.resultText || 'Auto-generated result'}\nPlayer of the Match: ${this.playerOfMatch}`
    );

    if (!ok) return;

    this.transitionService.completeMatchAndPromoteUpcoming(
      this.playerOfMatch.trim(),
      this.resultText.trim()
    );
  }
}