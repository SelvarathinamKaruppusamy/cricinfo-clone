import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AdminQuizService } from '../admin-quiz-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-quiz-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-quiz-component.html',
  styleUrl: './admin-quiz-component.css',
})
export class AdminQuizComponent implements OnInit {
  service = inject(AdminQuizService);
  change = inject(ChangeDetectorRef);

  questions: any[] = [];
  editMode = false;

  // Tracks whether Save has been attempted, so errors only show after a real submit
  submitted = false;

  quiz = {
    id: 0,
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: null as number | null,
  };

  errors = {
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAnswer: '',
  };

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.service.getAllQuestions().subscribe({
      next: (res) => {
        this.questions = res;
        this.change.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  validate(): boolean {
    this.errors = {
      question: this.quiz.question.trim() ? '' : 'Question text is required.',
      option1: this.quiz.option1.trim() ? '' : 'Option 1 is required.',
      option2: this.quiz.option2.trim() ? '' : 'Option 2 is required.',
      option3: this.quiz.option3.trim() ? '' : 'Option 3 is required.',
      option4: this.quiz.option4.trim() ? '' : 'Option 4 is required.',
      correctAnswer: this.quiz.correctAnswer ? '' : 'Select the correct option.',
    };

    // Count how many times each (trimmed, lowercased) option value appears
    const optionFields: Array<'option1' | 'option2' | 'option3' | 'option4'> = [
      'option1',
      'option2',
      'option3',
      'option4',
    ];

    const counts = new Map<string, number>();
    optionFields.forEach((field) => {
      const value = this.quiz[field].trim().toLowerCase();
      if (!value) return; // empty ones are already caught by the required check
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });

    // Flag every field whose value appears more than once, not just the first
    optionFields.forEach((field) => {
      const value = this.quiz[field].trim().toLowerCase();
      if (value && (counts.get(value) ?? 0) > 1 && !this.errors[field]) {
        this.errors[field] = 'Options must be unique.';
      }
    });

    return Object.values(this.errors).every((e) => e === '');
  }

  save() {
    this.submitted = true;

    if (!this.validate()) {
      this.change.detectChanges();
      return;
    }

    if (this.editMode) {
      this.service.updateQuestion(this.quiz.id, this.quiz).subscribe({
        next: () => {
          this.reset();
          this.loadQuestions();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update question. Please try again.');
        },
      });
      return;
    }

    this.service.addQuestion(this.quiz).subscribe({
      next: () => {
        this.reset();
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Add failed:', err);
        alert('Failed to add question. Please try again.');
      },
    });
  }

  edit(item: any) {
    this.editMode = true;
    this.submitted = false;
    this.quiz = { ...item };
  }

  delete(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this question?');
    if (!confirmDelete) return;

    this.service.deleteQuestion(id).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete question. Please try again.');
      },
    });
  }

  reset() {
    this.editMode = false;
    this.submitted = false;
    this.quiz = {
      id: 0,
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: null,
    };
    this.errors = {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctAnswer: '',
    };
  }
}
