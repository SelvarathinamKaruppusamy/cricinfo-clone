import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import {
  EditLastBallDialogComponent,
  EditLastBallDialogData,
} from './edit-last-ball-dialog-component';

describe('EditLastBallDialogComponent', () => {
  let component: EditLastBallDialogComponent;
  let fixture: ComponentFixture<EditLastBallDialogComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dialogData: EditLastBallDialogData = {
    currentBall: '4',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLastBallDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    })
      .overrideComponent(EditLastBallDialogComponent, {
        set: {
          template: '<div>Edit Last Ball Dialog</div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EditLastBallDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedBall from dialog data', () => {
    expect(component.selectedBall).toBe('4');
  });

  it('should contain all ball options', () => {
    expect(component.ballOptions).toEqual(['0', '1', '2', '3', '4', '6', 'W', 'Wd', 'Nb']);
  });

  it('should close dialog without data', () => {
    component.close();

    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });

  it('should close dialog with selected ball', () => {
    component.selectedBall = '6';

    component.save();

    expect(dialogRefMock.close).toHaveBeenCalledWith('6');
  });

  it('should save wicket', () => {
    component.selectedBall = 'W';

    component.save();

    expect(dialogRefMock.close).toHaveBeenCalledWith('W');
  });

  it('should save wide', () => {
    component.selectedBall = 'Wd';

    component.save();

    expect(dialogRefMock.close).toHaveBeenCalledWith('Wd');
  });

  it('should save no ball', () => {
    component.selectedBall = 'Nb';

    component.save();

    expect(dialogRefMock.close).toHaveBeenCalledWith('Nb');
  });
});
