import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface Blog {
  id: number;
  matchId: number;
  title: string;
  slug: string;
  image: string;
  shortDescription: string;
  category: string;
  author: string;
  content: string[];
  publishedDate: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './blog-details.html',
  styleUrls: ['./blog-details.css']
})
export class BlogDetails implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private apiUrl = 'http://localhost:3001/blogs';

  blog$!: Observable<Blog>;

  ngOnInit(): void {
    // Listen to route parameters changes, then immediately fetch the specific blog
    this.blog$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.http.get<Blog>(`${this.apiUrl}/${id}`);
      })
    );
  }
}