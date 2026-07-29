import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UpcService } from '../up-comp/upc-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatchData } from './match.models/match.models-module';
import { Team } from './match.models/match.models-module';
@Component({
  selector: 'app-match',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule,
    MatButtonModule,
    // RouterOutlet
  ],
  templateUrl: './match.html',
  styleUrl: './match.css',
  standalone: true,
})
export class Match implements OnInit {
  match!: MatchData;
  panel1 = true;
  panel2 = true;
  rout = inject(ActivatedRoute);
  service = inject(UpcService);
  cd = inject(ChangeDetectorRef);
  route = inject(Router);

 ngOnInit() {
  const matchNo = this.rout.snapshot.paramMap.get('matchNo')!;
 this.service.getMatchById(matchNo).subscribe({
    next: (res) => {

      // Convert "true,false,true" into [true, false, true]
      res.teams.forEach(team => {
        (team as any).matchStatus = (team.matchStatus as unknown as string)
          .split(',')
          .map(value => value.trim() === 'true');
      });

      this.match = res;
      this.cd.detectChanges();
    },

    error: (err) => {
      console.error(err);
    }
  });
}
  redirectfun() {
    this.route.navigate(['/upcoming']);
  }
  formatDate(date: string): string {
  const [year, day, month] = date.split('-');
  return `${day}-${month}-${year}`;
}

}
