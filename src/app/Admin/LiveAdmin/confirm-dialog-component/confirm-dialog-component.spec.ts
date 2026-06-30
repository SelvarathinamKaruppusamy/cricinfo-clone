import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog-component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dialogData: ConfirmDialogData = {
    title: 'Delete Match',
    message: 'Are you sure you want to delete this match?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'warn',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
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
      .overrideComponent(ConfirmDialogComponent, {
        set: {
          template: '<div>Confirm Dialog</div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive injected dialog data', () => {
    expect(component.data).toEqual(dialogData);
  });

  it('should initialize title', () => {
    expect(component.data.title).toBe('Delete Match');
  });

  it('should initialize message', () => {
    expect(component.data.message).toBe('Are you sure you want to delete this match?');
  });

  it('should initialize confirm text', () => {
    expect(component.data.confirmText).toBe('Delete');
  });

  it('should initialize cancel text', () => {
    expect(component.data.cancelText).toBe('Cancel');
  });

  it('should initialize dialog type', () => {
    expect(component.data.type).toBe('warn');
  });

  it('should close dialog with true when confirm() is called', () => {
    component.confirm();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when cancel() is called', () => {
    component.cancel();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });
});
