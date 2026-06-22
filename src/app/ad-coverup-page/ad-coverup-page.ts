import { Component } from '@angular/core';
import { IplNews } from '../LivePages/Models/models';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-coverup-page',
  imports: [MatCardModule,CommonModule],
  templateUrl: './ad-coverup-page.html',
  styleUrl: './ad-coverup-page.css',
})
export class AdCoverupPage {
  iplNews: IplNews[] = [
    {
  image: 'virat.jpg',
  title: 'Can King Kohli Lift His Second Trophy?',
  description: 'With RCB looking stronger than ever, fans are dreaming of Virat Kohli adding a second major trophy to his illustrious career.'
},
    {
  image: 'dhoni.jpg',
  title: 'Thala Returns to Rescue CSK',
  description: 'With CSK facing one of their toughest phases, MS Dhoni steps up once again, giving fans hope of a remarkable turnaround.'
},
    {
    image: 'playoffs.jpg',
    title: 'Race to the Playoffs Goes Down to the Wire',
    description: 'The battle for the final semifinal spots intensifies as teams fight to keep their IPL dreams alive.'
  }
  ];
}
