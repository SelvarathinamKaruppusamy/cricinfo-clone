import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminLoginService {
  private apiUrl = 'https://localhost:7144/api/auth';
  private logoutTimer: any;
  private warningTimer: any;

  private readonly WARNING_LEAD_MS = 15 * 60 * 1000; // 15 minutes before expiry

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }

  logout() {
    const currentUser = this.getCurrentUser();
    const userName = currentUser?.userName ?? '';
    return this.http.post(`${this.apiUrl}/logout`, { userName });
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

  // ---- Token expiry / auto-logout ----

  getTokenExpiry(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // exp is in seconds
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    return expiry ? Date.now() >= expiry : true;
  }

  scheduleAutoLogout(): void {
    this.clearAutoLogout();

    const expiry = this.getTokenExpiry();
    if (!expiry) return;

    const msUntilExpiry = expiry - Date.now();

    if (msUntilExpiry <= 0) {
      this.forceLogout();
      return;
    }

    // Schedule the warning, 15 minutes before expiry
    const msUntilWarning = msUntilExpiry - this.WARNING_LEAD_MS;

    if (msUntilWarning > 0) {
      this.warningTimer = setTimeout(() => {
        alert('Your session expires in 15 minutes. Please save your work.');
      }, msUntilWarning);
    } else {
      alert('Your session expires in 15 minutes. Please save your work.');
    }

    // Schedule the actual logout
    this.logoutTimer = setTimeout(() => this.forceLogout(), msUntilExpiry);
  }

  clearAutoLogout(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  forceLogout(): void {
    this.logout().subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession(),
    });
  }

  clearLocalSession(): void {
    this.clearAutoLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/admin';
  }
}