import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UpcService } from '../up-comp/upc-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-match',
  imports: [CommonModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './match.html',
  styleUrl: './match.css',
  standalone: true
})
export class Match implements OnInit {
  match: any;
  panel1=true;
  panel2=true;

  constructor(private rout: ActivatedRoute,
    private service: UpcService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.rout.snapshot.paramMap.get('id')!
    this.service.getMatchById(id).subscribe((res) => {
      this.match = res
      this.cd.detectChanges();

    })


  }

}
