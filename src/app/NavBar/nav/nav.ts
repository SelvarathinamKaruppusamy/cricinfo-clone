import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NavService } from './nav-service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-nav',
  imports: [MatToolbarModule, MatButtonModule, RouterLinkActive, RouterLink, MatIconModule,MatMenuModule],
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
