import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';

import { SelectBowlerDialogComponent } from './select-bowler-dialog-component';

describe('SelectBowlerDialogComponent', () => {
  let component: SelectBowlerDialogComponent;
  let fixture: ComponentFixture<SelectBowlerDialogComponent>;

  const dialogRefMock = {
    close: vi.fn(),
  };

  const dialogData = {
    bowlers: [
      {
        id: 1,
        name: 'Bumrah',
      },
      {
        id: 2,
        name: 'Shami',
      },
      {
        id: 3,
        name: 'Siraj',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBowlerDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefMock,
        },
      ],
    })
      .overrideComponent(SelectBowlerDialogComponent, {
        set: {
          template: '<div>Select Bowler Dialog</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SelectBowlerDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive dialog data', () => {
    expect(component.data).toEqual(dialogData);
  });

  it('should contain bowlers', () => {
    expect(component.data.bowlers.length).toBe(3);
  });

  it('should select first bowler', () => {
    component.select(0);

    expect(dialogRefMock.close).toHaveBeenCalledWith(0);
  });

  it('should select second bowler', () => {
    component.select(1);

    expect(dialogRefMock.close).toHaveBeenCalledWith(1);
  });

  it('should select third bowler', () => {
    component.select(2);

    expect(dialogRefMock.close).toHaveBeenCalledWith(2);
  });
});
