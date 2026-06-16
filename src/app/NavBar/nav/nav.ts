import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav',
  imports: [MatToolbarModule, MatButtonModule, RouterLinkActive, RouterLink, MatIconModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  items = [
    { label: 'Live', route: '/' },
    { label: 'Upcoming', route: '/upcoming' },
    { label: 'Completed', route: '/completed' },
    { label: 'Squads', route: '/squads' },
    { label: 'Points Table', route: '/points-table' },
    { label: 'Blog', route: '/blog' },
  ];
  constructor(private router: Router) {}
  activateRoute = '';

  getMethod(route: string) {
    this.activateRoute = route;
    this.router.navigateByUrl(route);
  }
   isNavbarVisible = true;
 private lastScrollTop = 0;
 
  @HostListener('window:scroll', [])
  onWindowScroll() {


  console.log('window scrolling');
 
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;
 
    if (currentScroll > this.lastScrollTop) {
      // Scrolling Down
      this.isNavbarVisible = false;
    } else {
      // Scrolling Up
      this.isNavbarVisible = true;
    }
     this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
