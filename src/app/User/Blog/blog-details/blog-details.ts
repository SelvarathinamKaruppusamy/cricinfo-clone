import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Blog } from '../../Completed/Models/match-module';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './blog-details.html',
  styleUrls: ['./blog-details.css'],
})
export class BlogDetails implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private apiUrl = 'https://localhost:7144/api/Blog/';

  blog$!: Observable<Blog>;

ngOnInit(): void {
  this.blog$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const matchId = params.get('id');

      return this.http.get<Blog>(`${this.apiUrl}${matchId}`);
    }),
  );
}
  

}
