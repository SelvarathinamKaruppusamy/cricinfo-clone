import { Component, OnDestroy, OnInit } from '@angular/core';
import { IplNews } from '../LivePages/Models/models';
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
      title: 'Can King Kohli Finally Bring Glory to Bengaluru?',
      description:
        'Virat Kohli continues to lead from the front as Royal Challengers Bengaluru mount another serious title challenge. With a balanced squad, match-winners in every department, and momentum on their side, fans are beginning to believe that this could finally be the season where Kohli lifts another major trophy and ends the long wait for IPL glory.',
    },
    {
      image: 'dhoni.png',
      title: 'Thala’s Presence Sparks New Hope for CSK',
      description:
        'When Chennai Super Kings needed inspiration the most, MS Dhoni once again became the center of attention. His leadership, calmness under pressure, and unmatched ability to influence big moments have reignited belief among CSK supporters, who dream of yet another memorable comeback story.',
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
