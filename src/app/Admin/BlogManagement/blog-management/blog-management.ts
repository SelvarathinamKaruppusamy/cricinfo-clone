import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { BlogManagementService } from '../services/blog-management';
import { Blog } from '../model/blog.model';
import { FormsModule } from '@angular/forms';

import { HighlightPipe } from './highlight.pipe';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, HighlightPipe],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.css',
})
export class BlogManagementComponent implements OnInit {
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  blogs: Blog[] = [];
  loading = true;

  searchText = '';
  filteredBlogs: Blog[] = [];

  ngOnInit(): void {
    this.loadBlogs();
  }

  constructor() {
    console.log('BlogManagementComponent Loaded');
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = [...blogs].reverse();
        this.filteredBlogs = [...this.blogs];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  addBlog(): void {
    this.router.navigate(['/navbarAdmin/blogs/add']);
  }

  editBlog(matchId: number): void {
    this.router.navigate(['/navbarAdmin/blogs/edit', matchId]);
  }

  deleteBlog(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this blog?');

    if (!confirmed) return;

    this.blogService.deleteBlog(id).subscribe({
      next: () => {
        this.loadBlogs(); // Reload blogs from json-server
      },

      error: (err) => {
        console.error('Delete Error:', err);
      },
    });
  }

  onSearch(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredBlogs = this.blogs.filter((blog) => blog.title.toLowerCase().includes(search));
  }
}
