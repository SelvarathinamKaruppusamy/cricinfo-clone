import { Component, computed, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { LiveService } from '../Services/live-service';
import { LiveModel } from '../Models/models';

@Component({
  selector: 'app-scorecard',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.css',
})
export class Scorecard implements OnInit {
  service = inject(LiveService);

  live!: LiveModel;

  ngOnInit(): void {
    this.live = this.service.live;
  }

  firstInningsTeam = computed(() => this.live?.teams?.[this.service.tosswin()]);

  secondInningsTeam = computed(() => this.live?.teams?.[this.service.tossloss()]);

  firstInningsBatters = computed(() => this.live?.teams?.[this.service.tosswin()].players);

  firstInningsBowlers = computed(() => this.live?.teams?.[this.service.tossloss()].players);

  secondInningsBatters = computed(() => this.live?.teams?.[this.service.tossloss()].players);

  secondInningsBowlers = computed(() => this.live?.teams?.[this.service.tosswin()].players);

  secondInningsStarted = computed(() => this.service.players1().length > 0);
}
