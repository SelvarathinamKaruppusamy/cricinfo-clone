import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompletedService } from '../Completed/Services/completed-service';
import { Pointstable } from './points-table-service';
@Component({
  selector: 'app-points-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './points-table.html',
  styleUrl: './points-table.css',
})
export class PointsTable implements OnInit {
  pointsTable: any[] = [];
  Math: any;

  constructor(
    private pointsTableService: Pointstable,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

 ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
    const matchNoParam = params.get('matchNo');

    if (matchNoParam) {
      this.loadPointsTable(Number(matchNoParam));
    } else {
      this.loadLatestPointsTable();
    }
  });
}

loadLatestPointsTable(): void {
  this.pointsTableService.getLatestPointsTable().subscribe({
    next: (data) => {
      this.pointsTable = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err),
  });
}

loadPointsTable(matchNo: number): void {
  this.pointsTableService.getPointsTable(matchNo).subscribe({
    next: (data) => {
      this.pointsTable = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err),
  });
}
}
