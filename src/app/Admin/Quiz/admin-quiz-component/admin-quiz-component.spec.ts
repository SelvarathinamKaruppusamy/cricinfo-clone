import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuizComponent } from './admin-quiz-component';

describe('AdminQuizComponent', () => {
  let component: AdminQuizComponent;
  let fixture: ComponentFixture<AdminQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminQuizComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
