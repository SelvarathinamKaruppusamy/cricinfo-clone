import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../model/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogManagementService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7144/api/Blog/';

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogByMatchId(matchId: number) {
    return this.http.get<Blog>(`${this.apiUrl}/${matchId}`);
  }

  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog);
  }

  updateBlog(matchId: number, blog: Blog) {
    return this.http.put<Blog>(`${this.apiUrl}${matchId}`, blog);
  }

  deleteBlog(matchId: number) {
    return this.http.delete(`${this.apiUrl}${matchId}`);
  }
}
