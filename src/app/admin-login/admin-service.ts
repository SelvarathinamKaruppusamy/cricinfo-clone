import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private isLoggedIn = false;
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  getAdmins() {
    return this.http.get<any[]>('http://localhost:9999/admin');
  }

  createAdmin(admin: any) {
    return this.http.post('http://localhost:9999/admin', admin);
  }

  updateAdmin(id: string, data: any) {
    return this.http.put(`http://localhost:9999/admin/${id}`, data);
  }

  setAuthenticated(value: boolean) {
    this.isLoggedIn = value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }
}