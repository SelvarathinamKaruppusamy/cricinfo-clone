import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animation } from '../Services/animation';

@Component({
  selector: 'app-score-event-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-event-animation.html',
  styleUrl: './score-event-animation.css'
})
export class ScoreEventAnimation {

  animation = inject(Animation);

  teamIndex = input.required<number>();

  // Dot balls (0 runs) carry no visual weight — skip them so the
  // container never renders a "0" badge.
  events = computed(() =>
    this.animation.events().filter(e =>
      e.team === this.teamIndex() &&
      !(e.type === 'run' && e.text?.trim() === '0')
    )
  );
}
