import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { UpcService } from './upc-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-up-comp',
  imports: [CommonModule],
  templateUrl: './up-comp.html',
  styleUrl: './up-comp.css',
  standalone:true
})
export class UpComp {

  cards:any[]=[];

  constructor(private service:UpcService,
    private cd:ChangeDetectorRef,
    private router:Router){}
 
  cardDetail(){
    alert('Testing');
  }

  ngOnInit(){
    this.service.getMatch().subscribe(matches=>{

     
      this.cards=matches.map((match:any)=>({
        id:match.id,
        status:match.status,
        matchNo:match.matchNo,
        city:match.city,
        stadium:match.venue,
        team1:match.teams[0],
        team2:match.teams[1],
        time:'7:30 PM ',
        date:match.date
      }));
     this.cd.detectChanges()
      //console.log(this.card);
    });
}
 open(id:number){
  this.router.navigate(['/match',id]);
}

}
