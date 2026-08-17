import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminQuizService {
  http = inject(HttpClient);

  api = 'https://localhost:7144/api/quiz';

  getAllQuestions() {
    return this.http.get<any[]>(`${this.api}/all`);
  }

  getQuestionById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  addQuestion(data: any) {
    return this.http.post(`${this.api}/add`, data);
  }

  updateQuestion(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteQuestion(id: number) {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text' });
  }
}
