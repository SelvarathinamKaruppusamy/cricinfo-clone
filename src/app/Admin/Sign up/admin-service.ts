import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3001/admins';

  getAdmins() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAdmin(admin: any) {
    return this.http.post(this.apiUrl, admin);
  }
}