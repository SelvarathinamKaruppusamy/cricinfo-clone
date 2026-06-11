import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commentary } from './commentary';

describe('Commentary', () => {
  let component: Commentary;
  let fixture: ComponentFixture<Commentary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commentary],
    }).compileComponents();

    fixture = TestBed.createComponent(Commentary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
