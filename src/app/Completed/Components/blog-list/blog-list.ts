import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule, FormsModule],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog-list.css'],
})
export class BlogList implements OnInit {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3001/blogs';

  searchTerm = '';

  private searchSubject = new BehaviorSubject<string>('');

  blogs$!: Observable<any[]>;

  ngOnInit(): void {
    const blogsData$ = this.http.get<any[]>(this.apiUrl).pipe(map((blogs) => [...blogs].reverse()));

    this.blogs$ = combineLatest([blogsData$, this.searchSubject]).pipe(
      map(([blogs, search]) => {
        if (!search.trim()) {
          return blogs;
        }

        const term = search.toLowerCase();

        return blogs.filter((blog) => {
          const tagMatch = blog.tags?.some((tag: string) => tag.toLowerCase().includes(term));

          return tagMatch;
        });
      }),
    );
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }
}
