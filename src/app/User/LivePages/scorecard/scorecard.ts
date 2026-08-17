import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LiveService } from '../Services/live-service';

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.css',
})
export class Scorecard {

  service = inject(LiveService);

  live = computed(() => this.service.live());

  // ---------------- FIRST INNINGS TEAM ----------------

  firstInningsTeam = computed(() => {

    const live = this.live();

    if (!live) return undefined;

    const tossWinnerIndex =
      live.teams.findIndex(
        t => t.shortName === live.tossWinner
      );

    if (tossWinnerIndex === -1) return undefined;

    if (live.tossDecision === 'Bat') {

      return live.teams[tossWinnerIndex];

    }

    return live.teams[tossWinnerIndex === 0 ? 1 : 0];

  });

  // ---------------- SECOND INNINGS TEAM ----------------

  secondInningsTeam = computed(() => {

    const live = this.live();

    if (!live) return undefined;

    const tossWinnerIndex =
      live.teams.findIndex(
        t => t.shortName === live.tossWinner
      );

    if (tossWinnerIndex === -1) return undefined;

    if (live.tossDecision === 'Bat') {

      return live.teams[tossWinnerIndex === 0 ? 1 : 0];

    }

    return live.teams[tossWinnerIndex];

  });

  // ---------------- FIRST INNINGS ----------------

  firstInningsBatters = computed(() =>

    this.firstInningsTeam()?.players ?? []

  );

  firstInningsBowlers = computed(() =>

    this.secondInningsTeam()?.players.filter(
      p =>
        p.role === 'Bowler' ||
        p.role === 'All-Rounder'
    ) ?? []

  );

  // ---------------- SECOND INNINGS ----------------

  secondInningsBatters = computed(() => {

    const live = this.live();

    if (!live) return [];

    if (live.currentInnings !== 2) return [];

    return this.secondInningsTeam()?.players ?? [];

  });

  secondInningsBowlers = computed(() => {

    const live = this.live();

    if (!live) return [];

    if (live.currentInnings !== 2) return [];

    return this.firstInningsTeam()?.players.filter(
      p =>
        p.role === 'Bowler' ||
        p.role === 'All-Rounder'
    ) ?? [];

  });

  // ---------------- SECOND INNINGS STARTED ----------------

  secondInningsStarted = computed(() => {

    const live = this.live();

    if (!live) return false;

    return live.currentInnings === 2;

  });

}