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
  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  createAdmin(admin: any) {
    return this.http.post(`${this.apiUrl}/register`, admin);
  }

  getProfile(userName: string) {
    return this.http.get<any>(`${this.apiUrl}/profile/${userName}`);
  }

  updateProfile(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/profile/${id}`, data);
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

  isAuthenticated() {
    return !!this.getToken();
  }
}
