import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage, ViewportScroller } from '@angular/common';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
export class BlogManagementComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private viewportScroller = inject(ViewportScroller);

  blogs: Blog[] = [];
  loading = true;

  searchText = '';
  filteredBlogs: Blog[] = [];

  showDeletePopup = false;
  selectedBlogId = 0;
  selectedBlogTitle = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.cdr.detectChanges();

    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
      this.toastTimeout = null;
    }, 3000);
  }

  closeToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastVisible = false;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.loadBlogs();

    this.checkForToastMessage();
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  private checkForToastMessage(): void {
    const toastMessage = localStorage.getItem('toastMessage');
    const toastType = localStorage.getItem('toastType') as 'success' | 'error';

    if (toastMessage) {
      setTimeout(() => {
        this.showToast(toastMessage, toastType || 'success');
        localStorage.removeItem('toastMessage');
        localStorage.removeItem('toastType');
      }, 500);
    }
  }

  loadBlogs(): void {
    this.loading = true;
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = [...blogs].sort((a, b) => b.matchId - a.matchId);
        this.filteredBlogs = [...this.blogs];
        this.loading = false;
        this.cdr.detectChanges();

        this.viewportScroller.scrollToPosition([0, 0]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        this.handleHttpError(err, 'Failed to load blogs. Please try again.');

        this.cdr.detectChanges();
      },
    });
  }

  addBlog(): void {
    this.router.navigate(['/navbarAdmin/blogs/add']);
  }

  editBlog(matchId: number): void {
    this.router.navigate(['/navbarAdmin/blogs/edit', matchId]);
  }

  deleteBlog(matchId: number): void {
    const blog = this.blogs.find((b) => b.matchId === matchId);

    if (!blog) {
      this.showToast('Blog not found. Please try again.', 'error');
      return;
    }

    this.selectedBlogId = matchId;
    this.selectedBlogTitle = blog.title;
    this.showDeletePopup = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    this.showDeletePopup = false;
    this.cdr.detectChanges();

    const blogTitle = this.selectedBlogTitle;
    const blogId = this.selectedBlogId;

    this.selectedBlogId = 0;
    this.selectedBlogTitle = '';

    this.blogService.deleteBlog(blogId).subscribe({
      next: () => {
        this.blogs = this.blogs.filter((blog) => blog.matchId !== blogId);
        this.filteredBlogs = this.filteredBlogs.filter((blog) => blog.matchId !== blogId);

        this.showToast(`"${blogTitle}" deleted successfully.`, 'success');
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.handleHttpError(err, 'Failed to delete blog. Please try again.');

        this.cdr.detectChanges();
      },
    });
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
    this.selectedBlogId = 0;
    this.selectedBlogTitle = '';
    this.cdr.detectChanges();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancelDelete();
    }
  }

  onSearch(): void {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.filteredBlogs = [...this.blogs];
      return;
    }

    this.filteredBlogs = this.blogs.filter((blog) => blog.title.toLowerCase().includes(search));
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchText = '';
    this.filteredBlogs = [...this.blogs];
    this.cdr.detectChanges();
  }

  trackByBlogId(index: number, blog: Blog): number {
    return blog.id;
  }

  private handleHttpError(error: HttpErrorResponse, defaultMessage: string): void {
    console.error('Blog Management API Error:', error);

    switch (error.status) {
      case 0:
        this.showToast(
          'Unable to connect to the server. Please check your internet connection.',
          'error',
        );
        break;

      case 400:
        this.showToast(
          error.error?.message || 'Invalid request. Please check the information and try again.',
          'error',
        );
        break;

      case 401:
        this.showToast('Your session has expired. Please login again.', 'error');
        break;

      case 403:
        this.showToast('You do not have permission to perform this action.', 'error');
        break;

      case 404:
        this.showToast(error.error?.message || 'The requested blog could not be found.', 'error');
        break;

      case 409:
        this.showToast(
          error.error?.message || 'The requested operation conflicts with existing data.',
          'error',
        );
        break;

      case 500:
        this.showToast('Something went wrong on the server. Please try again later.', 'error');
        break;

      case 502:
      case 503:
      case 504:
        this.showToast('The server is temporarily unavailable. Please try again later.', 'error');
        break;

      default:
        this.showToast(defaultMessage, 'error');
        break;
    }
  }
}
