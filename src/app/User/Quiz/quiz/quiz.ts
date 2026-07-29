import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  service = inject(QuizService);
  router = inject(Router);

  userName: string = '';
  score: number = 0;

  started: boolean = false;
  submitted: boolean = false;
  loading: boolean = false; // Added loading state

  currentQuestion: number = 0;
  questions: any[] = [];
  answers: any[] = [];

  ngOnInit() {
    // Reset any previous quiz state when component loads
    this.resetQuiz();
  }

  resetQuiz() {
    this.questions = [];
    this.answers = [];
    this.currentQuestion = 0;
    this.score = 0;
    this.started = false;
    this.submitted = false;
    this.loading = false;
  }

  startQuiz() {
    // Prevent multiple submissions
    if (this.loading) return;

    if (!this.userName.trim()) {
      alert('Please enter your name');
      return;
    }

    // Store username for leaderboard
    localStorage.setItem('quizUserName', this.userName.trim());
    this.loading = true;

    this.service.getQuestions().subscribe({
      next: (res: any[]) => {
        this.questions = res;
        if (this.questions.length > 0) {
          this.currentQuestion = 0;
          this.started = true;
          this.submitted = false;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log('ERROR:', err);
        this.loading = false;
        alert('Failed to load questions. Please try again.');
      },
    });
  }

  selectOption(questionId: number, option: number) {
    const existingIndex = this.answers.findIndex((x) => x.questionId === questionId);

    if (existingIndex !== -1) {
      this.answers[existingIndex].selectedOption = option;
    } else {
      this.answers.push({ questionId, selectedOption: option });
    }
  }

  isSelected(questionId: number, option: number): boolean {
    const ans = this.answers.find((x) => x.questionId === questionId);
    return ans?.selectedOption === option;
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  submitQuiz() {
    // Prevent multiple submissions
    if (this.loading) return;

    // Check if all questions are answered
    if (this.answers.length < this.questions.length) {
      const confirmSubmit = confirm(
        `You have answered ${this.answers.length} out of ${this.questions.length} questions. Do you want to submit anyway?`,
      );
      if (!confirmSubmit) return;
    }

    this.loading = true;

    const body = {
      userName: this.userName,
      answers: this.answers,
    };

    this.service.submitQuiz(body).subscribe({
      next: (res: number) => {
        this.score = res;
        this.submitted = true;
        this.started = false;
        this.loading = false;

        // Store username and navigate to leaderboard
        localStorage.setItem('quizUserName', this.userName.trim());
        this.router.navigate(['/leaderboard']);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        alert('Failed to submit quiz. Please try again.');
      },
    });
  }
}
