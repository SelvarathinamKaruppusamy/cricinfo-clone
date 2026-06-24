import { Component, OnInit, inject } from '@angular/core';

import { CommonModule, NgOptimizedImage } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';

import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { HighlightPipe } from './highlight.pipe';

@Component({
  selector: 'app-blog-list',

  standalone: true,

  imports: [CommonModule, NgOptimizedImage, RouterModule, FormsModule, HighlightPipe],

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
        const term = search.trim().toLowerCase();

        if (!term) {
          return blogs;
        }

        return blogs.filter((blog) => {
          const titleMatch = blog.title?.toLowerCase().includes(term);

          const shortDescriptionMatch = blog.shortDescription?.toLowerCase().includes(term);

          const contentMatch = blog.content?.some((paragraph: string) =>
            paragraph.toLowerCase().includes(term),
          );

          const tagsMatch = blog.tags?.some((tag: string) => tag.toLowerCase().includes(term));

          return titleMatch || shortDescriptionMatch || contentMatch || tagsMatch;
        });
      }),
    );
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchSubject.next(value);
  }
}
