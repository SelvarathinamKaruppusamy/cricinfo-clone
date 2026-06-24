<<<<<<< HEAD:src/app/ad-coverup-page/ad-coverup-page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IplNews } from '../LivePages/Models/models';
=======
import { Component } from '@angular/core';
import { IplNews } from '../Models/models';
>>>>>>> feature/admin-live:src/app/LivePages/ad-coverup-page/ad-coverup-page.ts
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-coverup-page',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './ad-coverup-page.html',
  styleUrl: './ad-coverup-page.css',
})
export class AdCoverupPage implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId: any;

  iplNews: IplNews[] = [
    {
  image: 'virat.jpg',
  title: 'Can King Kohli Lift His Second Trophy?',
  description: 'With RCB looking stronger than ever, fans are dreaming of Virat Kohli adding a second major trophy to his illustrious career.'
},
    {
  image: 'dhoni.png',
  title: 'Thala Returns to Rescue CSK',
  description: 'With CSK facing one of their toughest phases, MS Dhoni steps up once again, giving fans hope of a remarkable turnaround.'
},
    {
      image: 'playoffs.jpg',
      title: 'Playoff Race Heats Up as Every Match Becomes a Final',
      description:
        'With the league stage entering its decisive phase, the race for the playoff spots is more intense than ever. Teams are separated by the finest of margins, making every run, wicket, and point crucial. One victory can transform a campaign, while one defeat could end championship hopes.',
    },
  ];

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.iplNews.length;
  }

  previousSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.iplNews.length) % this.iplNews.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  get currentNews(): IplNews {
    return this.iplNews[this.currentIndex];
  }
}
