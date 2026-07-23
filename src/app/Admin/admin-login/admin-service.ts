import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:7144/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');

    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
  getProfile(username: string) {
  return this.http.get(
    `https://localhost:7014/api/auth/profile/${username}`
  );
}

updateProfile(id: number, data: any) {
  return this.http.put(
    `https://localhost:7014/api/auth/profile/${id}`,
    data
  );
}
}
