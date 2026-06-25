import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BlogManagementService } from '../services/blog-management';
import { Blog } from '../model/blog.model';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blog-form.html',
  styleUrl: './blog-form.css',
})
export class BlogForm implements OnInit {
  private fb = inject(FormBuilder);
  private blogService = inject(BlogManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  blogForm!: FormGroup;

  isEditMode = false;

  // Route param (matchId)
  blogId = '';

  // Actual JSON Server id
  actualId = '';

  previewUrl: string | null = null;

  selectedFile: File | null = null;

  ngOnInit(): void {
    this.blogForm = this.fb.group({
      matchId: [0, Validators.required],
      title: ['', Validators.required],
      slug: [''],
      image: ['', Validators.required],
      shortDescription: ['', Validators.required],
      category: ['', Validators.required],
      author: ['CrickInfo Team', Validators.required],
      content: ['', Validators.required],
      publishedDate: ['', Validators.required],
      readTime: ['4 min read'],
      featured: [false],
      tags: [''],
    });

    this.blogId = this.route.snapshot.paramMap.get('id') ?? '';

    if (this.blogId) {
      this.isEditMode = true;
      this.loadBlog();
    }
  }

  loadBlog(): void {
    const matchId = Number(this.blogId);

    this.blogService.getBlogs().subscribe((blogs) => {
      const blog = blogs.find((b) => b.matchId === matchId);

      if (!blog) {
        console.error('Blog not found');
        return;
      }

      // Store actual JSON Server id
      this.actualId = blog.id;

      this.previewUrl = `https://res.cloudinary.com/dde7fld9d/image/upload/${blog.image}`;

      this.blogForm.patchValue({
        ...blog,
        content: blog.content.join('\n\n'),
        tags: blog.tags.join(', '),
      });
    });
  }

  cancel(): void {
    console.log('clicked');
    this.router.navigate(['/navbarAdmin/blogs']);
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }

  onTitleChange(): void {
    const title = this.blogForm.get('title')?.value;

    if (!title) return;

    this.blogForm.patchValue({
      slug: this.generateSlug(title),
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Instant preview
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  saveBlog(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();

      formData.append('file', this.selectedFile);

      formData.append('upload_preset', 'cricinfo_blog_upload');

      this.http
        .post<any>('https://api.cloudinary.com/v1_1/dde7fld9d/image/upload', formData)
        .subscribe({
          next: (response) => {
            const imagePath = `f_auto/v${response.version}/${response.public_id}.jpg`;

            this.updateBlog(imagePath);
          },

          error: (err) => {
            console.error(err);

            alert('Image Upload Failed');
          },
        });
    } else {
      const currentImage = this.blogForm.get('image')?.value;

      this.updateBlog(currentImage);
    }
  }

  private updateBlog(imagePath: string): void {
    const formValue = this.blogForm.value;

    const blog: Blog = {
      id: this.actualId,

      matchId: Number(formValue.matchId),

      title: formValue.title,

      slug: formValue.slug,

      image: imagePath,

      shortDescription: formValue.shortDescription,

      category: formValue.category,

      author: formValue.author,

      content: formValue.content.split('\n').filter((p: string) => p.trim()),

      publishedDate: formValue.publishedDate,

      readTime: formValue.readTime,

      featured: formValue.featured,

      tags: formValue.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    };

    this.blogService.updateBlog(this.actualId, blog).subscribe({
      next: () => {
        alert('Blog Updated Successfully');

        this.router.navigate(['/navbarAdmin/blogs']);
      },

      error: (err) => {
        console.error(err);

        alert('Failed To Update Blog');
      },
    });
  }
}
