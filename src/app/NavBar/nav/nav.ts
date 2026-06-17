import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

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
    {label : 'squads',route : '/squads'},
    { label: 'Points Table', route: '/points-table' },
    { label: 'Blog', route: '/blog' },
  ];
  constructor(private router: Router) {}
  activateRoute = '';

  getMethod(route: string) {
    this.activateRoute = route;
    this.router.navigateByUrl(route);
  }
}
