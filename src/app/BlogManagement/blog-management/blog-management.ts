import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { BlogManagementService } from '../services/blog-management';
import { Blog } from '../model/blog.model';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.css',
})
export class BlogManagementComponent implements OnInit {
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  blogs: Blog[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadBlogs();
  }

  constructor() {
    console.log('BlogManagementComponent Loaded');
  }

  loadBlogs(): void {
    console.log('loadBlogs called');

    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        console.log('Blogs received:', blogs);
        this.blogs = blogs.reverse();

        console.log('After assignment:', this.blogs);

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
    this.router.navigate(['/admin/blogs/add']);
  }

  editBlog(matchId: number): void {
    this.router.navigate(['/admin/blogs/edit', matchId]);
  }

  deleteBlog(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this blog?');

    if (!confirmed) return;

    this.blogService.deleteBlog(id).subscribe({
      next: () => {
        this.blogs = this.blogs.filter((blog) => blog.id !== id);
      },

      error: (err) => console.error(err),
    });
  }
}
