import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlogManagementService } from '../services/blog-management';

@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.css',
})
export class AddBlog implements OnDestroy {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private http = inject(HttpClient);

  blogForm = this.fb.group({
    title: ['', Validators.required],
    slug: [''],
    shortDescription: ['', Validators.required],
    content: ['', Validators.required],
    image: [''],
    readTime: ['4 min read', Validators.required],
    publishedDate: [new Date().toISOString().split('T')[0], Validators.required],
    tags: [''],
    featured: [false],
  });

  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isSaving = false;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  cancel(): void {
    this.router.navigate(['/navbarAdmin/blogs']);
  }

  showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }

    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
      this.toastTimeout = null;
    }, 3000);
  }

  closeToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastVisible = false;
  }

  ngOnDestroy(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  saveBlog(): void {
    if (this.isSaving) return;

    if (this.blogForm.invalid) {
      this.showToast('Please fill all required fields.', 'error');
      return;
    }

    if (!this.selectedFile) {
      this.showToast('Please select an image.', 'error');
      return;
    }

    this.isSaving = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'cricinfo_blog_upload');

    this.http
      .post<any>('https://api.cloudinary.com/v1_1/dde7fld9d/image/upload', formData)
      .subscribe({
        next: (cloudinaryResponse) => {
          const imagePath = `f_auto/v${cloudinaryResponse.version}/${cloudinaryResponse.public_id}.jpg`;
          const formValue = this.blogForm.value;

          this.blogService.getBlogs().subscribe({
            next: (blogs: any[]) => {
              const nextId = Math.max(...blogs.map((blog) => blog.matchId || 0)) + 1;

              const blog = {
                id: nextId.toString(),
                matchId: nextId,
                title: formValue.title,
                slug: formValue.slug,
                image: imagePath,
                shortDescription: formValue.shortDescription,
                category: 'Match Report',
                author: 'CrickInfo Team',
                content: formValue.content!.split('\n').filter((p) => p.trim()),
                publishedDate: formValue.publishedDate,
                readTime: formValue.readTime,
                featured: false,
                tags: formValue.tags
                  ? formValue.tags
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  : [],
              };

              this.blogService.addBlog(blog as any).subscribe({
                next: () => {
                  this.isSaving = false;

                  // Store toast message in localStorage before navigation
                  localStorage.setItem('toastMessage', `"${blog.title}" published successfully!`);
                  localStorage.setItem('toastType', 'success');

                  // Navigate to blogs page
                  this.router.navigate(['/navbarAdmin/blogs']);
                },
                error: (err) => {
                  console.error('Blog Save Error', err);
                  this.isSaving = false;
                  this.showToast('Failed to publish blog. Please try again.', 'error');
                },
              });
            },
            error: (err) => {
              console.error('Error fetching blogs', err);
              this.isSaving = false;
              this.showToast('Failed to save blog. Please try again.', 'error');
            },
          });
        },
        error: (err) => {
          console.error('Cloudinary Upload Error', err);
          this.isSaving = false;
          this.showToast('Image upload failed. Please try again.', 'error');
        },
      });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    this.selectedFile = input.files[0];
    this.previewUrl = URL.createObjectURL(this.selectedFile);
  }

  generateSlug(): void {
    const title = this.blogForm.get('title')?.value;
    if (!title) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');

    this.blogForm.patchValue({
      slug,
    });
  }
}
