import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-nav-bar',
  imports: [MatToolbarModule,
   
    MatIcon,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  standalone:true
})
export class NavBar {
rout=[
  // {label:'Live', routes:'/'},
  {label:'UpComing', routes:'/upComeAdmin'},
  // {label:'completed',routes:'/completedAdmin' }
];

router=inject(Router);
cd=inject(ChangeDetectorRef);
activateRoute='';

getRoute(route:string){
this.activateRoute=route;
this.router.navigateByUrl(route);
this.cd.detectChanges();
console.log('NavbarAdmin');
}

}
