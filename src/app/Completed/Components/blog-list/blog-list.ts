import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './blog-list.html',
  styleUrls: ['./blog-list.css']
})
export class BlogList implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/blogs';
  
  blogs$!: Observable<any[]>; 

  ngOnInit(): void {
    this.blogs$ = this.http.get<any[]>(this.apiUrl);
  }
}