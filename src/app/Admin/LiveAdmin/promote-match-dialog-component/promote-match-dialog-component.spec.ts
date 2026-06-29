import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteMatchDialogComponent } from './promote-match-dialog-component';

describe('PromoteMatchDialogComponent', () => {
  let component: PromoteMatchDialogComponent;
  let fixture: ComponentFixture<PromoteMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteMatchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PromoteMatchDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
