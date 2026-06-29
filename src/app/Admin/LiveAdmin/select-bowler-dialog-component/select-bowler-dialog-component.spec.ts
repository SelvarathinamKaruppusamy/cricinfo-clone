import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBowlerDialogComponent } from './select-bowler-dialog-component';

describe('SelectBowlerDialogComponent', () => {
  let component: SelectBowlerDialogComponent;
  let fixture: ComponentFixture<SelectBowlerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBowlerDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBowlerDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
