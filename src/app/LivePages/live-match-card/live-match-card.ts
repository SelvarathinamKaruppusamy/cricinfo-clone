import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { LiveService } from '../Services/live-service';
import { LiveModel, Player, Team } from '../Models/models';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';
import { UpcService } from '../../UpCommingPage/up-comp/upc-service';
import { CompletedService } from '../../Completed/Services/completed-service';
import { Match } from '../../Completed/Models/match-module';
 import { ElementRef, ViewChild } from '@angular/core';
import { AdCoverupPage } from '../../ad-coverup-page/ad-coverup-page';
@Component({
  selector: 'app-live-match-card',
  imports: [MatIconModule, CommonModule, MatCardModule,RouterOutlet,AdCoverupPage],
  templateUrl: './live-match-card.html',
  styleUrl: './live-match-card.css',
})
export class LiveMatchCard implements OnInit {
  @ViewChild('cardContainer')
cardContainer!: ElementRef<HTMLDivElement>;
  live!: LiveModel;
  service = inject(LiveService);
  changedetector = inject(ChangeDetectorRef);
  upservice=inject(UpcService)
  route = inject(Router);
  team1!:Team
  team2!:Team
  upteam1!:Team
  upteam2!:Team
  target = 0;
  requiredRuns = 0;
  remainingBalls =120;
  six=6;
  totalBalls=0
  upcommingdata!:LiveModel
  completeddata:Match[]=[]
  comservice=inject(CompletedService)
 

  constructor(){
    effect(()=>{
      this.service?.ball()
       this.team1=this.service.live.teams[0]
      this.team2=this.service.live.teams[1]
      this.requiredRun()
      this.changedetector.detectChanges()
      console.log(this.service.live)
    })
  }
  ngOnInit(): void {
    this.service?.GetLiveMatches().subscribe((res) => {
      this.live = res[0];
      this.service.live = this.live;
      this.team1=this.live.teams[0]
      this.team2=this.live.teams[1]
      this.changedetector.detectChanges();
      //console.log(this.upcommingdata)
    });
    this.upservice?.getMatch().subscribe((res)=>{
      this.upcommingdata=res[0]
      this.upteam1=this.upcommingdata.teams[0]
      this.upteam2=this.upcommingdata.teams[1]
      console.log(this.upcommingdata)
      this.changedetector.detectChanges()
    });
    this.comservice.getCompletedMatches().subscribe((res) => {
  this.completeddata = res.slice(-5).reverse();   // Last 5 matches
  this.changedetector.detectChanges();
  console.log(this.completeddata);
});
    
  }
  scrollLeft() {
  this.cardContainer.nativeElement.scrollBy({
    left: -370,
    behavior: 'smooth'
  });
}

scrollRight() {
  this.cardContainer.nativeElement.scrollBy({
    left: 370,
    behavior: 'smooth'
  });
}
  requiredRun() {
    if (this.service.innings() === 2) {
      this.target = this.service?.completedBattingTeam.scores + 1;
      this.requiredRuns =
        this.target - this.service.live.teams[this.service?.currentBattingTeam()].scores;

      const ballsBowled =
        Math.floor(this.live.teams[this.service?.tossloss()].overs) * this.six +
        Math.round((this.live.teams[this.service?.tossloss()].overs % 1) * 10);

      this.remainingBalls = this.totalBalls - ballsBowled;
    }
  }
  movetolivepage() {
    // console.log(this.team1)
    this.route.navigateByUrl('/live/livepage');
  }
  movetoupcommingpage(){
    this.route.navigateByUrl(`/live/match/${this.upcommingdata.id}`);
  }
  completedpage(matchNo: number): void {
  this.route.navigate(['/live/completed', matchNo]);
  }
  table(id:number){
    this.route.navigate(['/points-table',id])
  }
}
