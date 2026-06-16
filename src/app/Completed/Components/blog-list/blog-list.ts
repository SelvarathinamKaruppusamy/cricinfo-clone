import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  blogs: any[] = [];

  filteredBlogs: any[] = [];

  searchText: string = '';

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/blogs';

  blogs$!: Observable<any[]>;

  ngOnInit(): void {
    this.blogs$ = this.http.get<any[]>(this.apiUrl);
  }
}
