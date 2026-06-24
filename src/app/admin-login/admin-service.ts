import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

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
    sessionStorage.setItem('isLoggedIn', value.toString());
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }

  setCurrentUser(user: any) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');

    return user ? JSON.parse(user) : null;
  }

  logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
  }
}