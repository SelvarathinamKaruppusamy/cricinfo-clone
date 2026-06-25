import { Component, inject } from '@angular/core';
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
export class AddBlog {
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

  cancel(): void {
    console.log('clicked');
    this.router.navigate(['/navbarAdmin/blogs']);
  }

  saveBlog(): void {
    if (this.blogForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    if (!this.selectedFile) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();

    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'cricinfo_blog_upload');

    this.http
      .post<any>('https://api.cloudinary.com/v1_1/dde7fld9d/image/upload', formData)
      .subscribe({
        next: (cloudinaryResponse) => {
          const imagePath = `f_auto/v${cloudinaryResponse.version}/${cloudinaryResponse.public_id}.jpg`;

          const formValue = this.blogForm.value;

          this.blogService.getBlogs().subscribe((blogs: any[]) => {
            const numericIds = blogs.map((blog) => Number(blog.id)).filter((id) => !isNaN(id));

            const nextId = Math.max(...blogs.map((blog) => blog.matchId || 0)) + 1;

            console.log('Next ID:', nextId);

            const blog = {
              id: nextId,

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

            console.log('Saving Blog:', blog);
            this.blogService.addBlog(blog as any).subscribe({
              next: () => {
                alert('Blog Added Successfully');

                this.router.navigate(['/navbarAdmin/blogs']);
              },

              error: (err) => {
                console.error('Blog Save Error', err);

                alert('Failed to save blog');
              },
            });
          });
        },

        error: (err) => {
          console.error('Cloudinary Upload Error', err);

          alert('Image upload failed');
        },
      });
  }

  previewUrl: string | null = null;

  selectedFile: File | null = null;

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
