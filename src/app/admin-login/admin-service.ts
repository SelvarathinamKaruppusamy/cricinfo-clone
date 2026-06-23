import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  
  private isLoggedIn = false;

  constructor(private http: HttpClient) {}

  getAdmins() {
    return this.http.get<any[]>(
      'http://localhost:9999/admin'
    );
  }

  setAuthenticated(value: boolean) {
    this.isLoggedIn = value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  logout() {
    this.isLoggedIn = false;
  }
}
