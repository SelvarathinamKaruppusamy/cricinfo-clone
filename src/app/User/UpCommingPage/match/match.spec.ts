import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import { Match } from './match';
import { UpcService } from '../up-comp/upc-service';

describe('Match', () => {
  let component: Match;
  let fixture: ComponentFixture<Match>;

  const mockMatch = {
    id: 1,
    matchNo: 1,
    city: 'Chennai',
    venue: 'Chepauk',
    date: '2025-06-23',
    status: 'Upcoming',
    teams: [
      {
        teamId: 1,
        shortName: 'CSK',
        fullName: 'Chennai Super Kings',
        logo: 'csk.png',
        winCount: 5,
        lossCount: 2,
        matchStatus: [true, false, true, true, false],
        players: [
          {
            id: 1,
            name: 'MS Dhoni',
            role: 'Wicket Keeper',
          },
        ],
      },
      {
        teamId: 2,
        shortName: 'MI',
        fullName: 'Mumbai Indians',
        logo: 'mi.png',
        winCount: 4,
        lossCount: 3,
        matchStatus: [false, true, false, true, true],
        players: [
          {
            id: 2,
            name: 'Rohit Sharma',
            role: 'Batter',
          },
        ],
      },
    ],
  };

  const mockUpcService = {
    getMatchById: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    mockUpcService.getMatchById.mockReturnValue(of(mockMatch));

    await TestBed.configureTestingModule({
      imports: [Match],
      providers: [
        {
          provide: UpcService,
          useValue: mockUpcService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('1'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Match);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load match on init', () => {
    component.ngOnInit();

    expect(mockUpcService.getMatchById).toHaveBeenCalledWith('1');
    expect(component.match).toEqual(mockMatch);
  });

  it('should navigate to upcoming page', () => {
    component.redirectfun();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/upcoming']);
  });

  it('should format date correctly', () => {
    const result = component.formatDate('2025-23-06');

    expect(result).toBe('23-06-2025');
  });
});