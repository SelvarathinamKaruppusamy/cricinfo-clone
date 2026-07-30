import { TestBed } from '@angular/core/testing';

import { AdminQuizService } from './admin-quiz-service';

describe('AdminQuizService', () => {
  let service: AdminQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
