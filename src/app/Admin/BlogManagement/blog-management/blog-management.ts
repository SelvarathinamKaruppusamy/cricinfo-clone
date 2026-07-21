import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';

import { BlogManagementService } from '../services/blog-management';
import { Blog } from '../model/blog.model';
import { FormsModule } from '@angular/forms';

import { HighlightPipe } from './highlight.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule, HighlightPipe, MatSnackBarModule],
  templateUrl: './blog-management.html',
  styleUrl: './blog-management.css',
})
export class BlogManagementComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  private viewportScroller = inject(ViewportScroller);

  blogs: Blog[] = [];
  loading = true;

  searchText = '';
  filteredBlogs: Blog[] = [];

  showDeletePopup = false;
  selectedBlogId = '';
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

    console.log('Showing toast:', message, type);

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

    console.log('Toast from localStorage:', toastMessage, toastType);

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
        this.blogs = [...blogs].reverse();
        this.filteredBlogs = [...this.blogs];
        this.loading = false;
        this.cdr.detectChanges();

        this.viewportScroller.scrollToPosition([0, 0]);
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.loading = false;
        this.showToast('Failed to load blogs. Please try again.', 'error');
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

  deleteBlog(id: string): void {
    console.log('Delete called with ID:', id);

    const blog = this.blogs.find((b) => b.id === id);
    if (!blog) {
      console.error('Blog not found with ID:', id);
      this.showToast('Blog not found. Please try again.', 'error');
      return;
    }

    this.selectedBlogId = id;
    this.selectedBlogTitle = blog.title;
    this.showDeletePopup = true;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    this.showDeletePopup = false;
    this.cdr.detectChanges();

    const blogTitle = this.selectedBlogTitle;
    const blogId = this.selectedBlogId;

    this.selectedBlogId = '';
    this.selectedBlogTitle = '';

    this.blogService.deleteBlog(blogId).subscribe({
      next: () => {
        this.blogs = this.blogs.filter((blog) => blog.id !== blogId);
        this.filteredBlogs = this.filteredBlogs.filter((blog) => blog.id !== blogId);

        this.showToast(`"${blogTitle}" deleted successfully.`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting blog:', err);
        this.showToast('Failed to delete blog. Please try again.', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
    this.selectedBlogId = '';
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

  trackByBlogId(index: number, blog: Blog): string {
    return blog.id;
  }
}
