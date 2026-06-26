import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLastBallDialogComponent } from './edit-last-ball-dialog-component';

describe('EditLastBallDialogComponent', () => {
  let component: EditLastBallDialogComponent;
  let fixture: ComponentFixture<EditLastBallDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLastBallDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLastBallDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
