import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PointsTable } from './points-table';
import { CompletedService } from '../Completed/Services/completed-service';

describe('PointsTable', () => {
  let component: PointsTable;
  let fixture: ComponentFixture<PointsTable>;

  const mockCompletedService = {
    getCompletedMatches: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsTable],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                matchNo: '5',
              })
            ),
          },
        },
        {
          provide: CompletedService,
          useValue: mockCompletedService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PointsTable);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load points table on init', () => {
    mockCompletedService.getCompletedMatches.mockReturnValue(
      of([])
    );

    const spy = vi.spyOn(component, 'loadPointsTable');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(5);
  });

  it('should calculate team points', () => {
    const matches = [
      {
        matchNo: 1,
        teams: [
          {
            teamId: 1,
            shortName: 'CSK',
            logo: '',
            totalMatch: 1,
            winCount: 1,
            lossCount: 0,
            matchStatus: ['W'],
            runs: 180,
            balls: 120,
          },
          {
            teamId: 2,
            shortName: 'MI',
            logo: '',
            totalMatch: 1,
            winCount: 0,
            lossCount: 1,
            matchStatus: ['L'],
            runs: 170,
            balls: 120,
          },
        ],
      },
    ];

    mockCompletedService.getCompletedMatches.mockReturnValue(
      of(matches)
    );

    component.loadPointsTable();

    expect(component.pointsTable.length).toBe(2);

    const csk = component.pointsTable.find(
      (t) => t.teamId === 1
    );

    expect(csk.points).toBe(2);
    expect(csk.wins).toBe(1);
    expect(csk.losses).toBe(0);
  });

  it('should calculate NRR', () => {
    const matches = [
      {
        matchNo: 1,
        teams: [
          {
            teamId: 1,
            shortName: 'CSK',
            logo: '',
            totalMatch: 1,
            winCount: 1,
            lossCount: 0,
            matchStatus: ['W'],
            runs: 180,
            balls: 120,
          },
          {
            teamId: 2,
            shortName: 'MI',
            logo: '',
            totalMatch: 1,
            winCount: 0,
            lossCount: 1,
            matchStatus: ['L'],
            runs: 150,
            balls: 120,
          },
        ],
      },
    ];

    mockCompletedService.getCompletedMatches.mockReturnValue(
      of(matches)
    );

    component.loadPointsTable();

    const csk = component.pointsTable.find(
      (t) => t.teamId === 1
    );

    expect(csk.nrr).toBeGreaterThan(0);
  });

  it('should sort teams by points', () => {
    const matches = [
      {
        matchNo: 1,
        teams: [
          {
            teamId: 1,
            shortName: 'CSK',
            logo: '',
            totalMatch: 1,
            winCount: 1,
            lossCount: 0,
            matchStatus: ['W'],
            runs: 180,
            balls: 120,
          },
          {
            teamId: 2,
            shortName: 'MI',
            logo: '',
            totalMatch: 1,
            winCount: 0,
            lossCount: 1,
            matchStatus: ['L'],
            runs: 150,
            balls: 120,
          },
        ],
      },
    ];

    mockCompletedService.getCompletedMatches.mockReturnValue(
      of(matches)
    );

    component.loadPointsTable();

    expect(component.pointsTable[0].teamId).toBe(1);
  });
});