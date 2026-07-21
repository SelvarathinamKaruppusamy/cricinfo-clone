import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { NavService } from './nav-service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-nav',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    // MatDivider,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    // RouterLinkActive,
    // RouterLink,
    MatIconModule,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  items = [
    { label: 'Live', route: '/' },
    { label: 'Upcoming', route: '/upcoming' },
    { label: 'Completed', route: '/completed' },
    { label: 'Points Table', route: '/points-table' },
    { label: 'Blog', route: '/blog' },
  ];
  router = inject(Router);
  service = inject(NavService);
  cd = inject(ChangeDetectorRef);
  activateRoute = '';
  getMethod(route: string) {
    this.activateRoute = route;
    this.router.navigateByUrl(route);
  }
}
