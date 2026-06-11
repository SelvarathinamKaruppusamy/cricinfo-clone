import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { LiveService } from '../Services/live-service';
import { LiveModel, Player } from '../Models/models';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-live-match-card',
  imports: [MatIconModule, CommonModule, MatCardModule],
  templateUrl: './live-match-card.html',
  styleUrl: './live-match-card.css',
})
export class LiveMatchCard implements OnInit {
  live!: LiveModel;
  service = inject(LiveService);
  // striker!:Player
  // nonStriker!:Player
  changedetector = inject(ChangeDetectorRef);
  // toss!:string
  route = inject(Router);
  ngOnInit(): void {
    this.service?.GetLiveMatches().subscribe((res) => {
      this.live = res[0];
      this.service.live = this.live;
      this.changedetector.detectChanges();
    });
  }
  movetolivepage() {
    this.route.navigateByUrl('/livepage');
  }
}
