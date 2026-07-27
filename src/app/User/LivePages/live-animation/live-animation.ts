import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  LottieComponent,
  AnimationOptions,
} from 'ngx-lottie';

import { Animation } from '../Services/animation';

@Component({
  selector: 'app-live-animation',
  standalone: true,
  imports: [
    CommonModule,
    LottieComponent,
  ],
  templateUrl: './live-animation.html',
  styleUrl: './live-animation.css',
})
export class LiveAnimation {

  animation = inject(Animation);
  defaultVisible = computed(() => this.animation.defaultAnimation());
winnerVisible = computed(() => this.animation.winnerVisible());
  visible = computed(() => this.animation.visible());

  options = computed<AnimationOptions>(() => ({
    path: this.animation.animationPath(),
  }));

}