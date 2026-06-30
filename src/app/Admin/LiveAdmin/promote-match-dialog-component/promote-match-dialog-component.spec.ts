import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PromoteMatchDialogComponent } from './promote-match-dialog-component';

describe('PromoteMatchDialogComponent', () => {
  let component: PromoteMatchDialogComponent;
  let fixture: ComponentFixture<PromoteMatchDialogComponent>;

  const mockData = {
    id: 1,
    status: 'LIVE',
    teams: [
      {
        shortName: 'RCB',
        logo: 'rcb.png',
      },
      {
        shortName: 'CSK',
        logo: 'csk.png',
      },
    ],
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoteMatchDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockData,
        },
      ],
    })
      .overrideComponent(PromoteMatchDialogComponent, {
        set: {
          template: '<div>Promote Match Dialog</div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PromoteMatchDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject dialog data', () => {
    expect(component.data).toEqual(mockData);
  });

  it('should contain first team details', () => {
    expect(component.data.teams[0].shortName).toBe('RCB');
  });

  it('should contain second team details', () => {
    expect(component.data.teams[1].shortName).toBe('CSK');
  });

  it('should contain match status', () => {
    expect(component.data.status).toBe('LIVE');
  });
});
