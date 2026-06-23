import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Livepage } from './livepage';
import { LiveService } from '../Services/live-service';

describe('Livepage', () => {
  let component: Livepage;
  let fixture: ComponentFixture<Livepage>;

  const mockLiveService: any = {
    ball: signal([]),

    tosswin: signal(0),

    tossloss: vi.fn(() => 1),

    currentBattingTeam: signal(0),

    currentBowlingTeam: signal(1),

    currentBowlerIndex: signal(0),

    players1: signal([]),

    bowlers1: signal([]),

    completedBattingTeam: {
      scores: 180,
    },

    live: null,

    GetLiveMatches: vi.fn(),

    addBall: vi.fn(),

    startSecondInnings: vi.fn(),
  };

  beforeEach(async () => {
    mockLiveService.GetLiveMatches.mockReturnValue(
      of([
        {
          teams: [
            {
              shortName: 'RCB',
              scores: 0,
              wickets: 0,
              overs: 0,
              extras: 0,
              players: [
                {
                  id: 1,
                  name: 'Virat',
                  role: 'Batter',
                  status: '',
                },
                {
                  id: 2,
                  name: 'Faf',
                  role: 'Batter',
                  status: '',
                },
              ],
            },
            {
              shortName: 'CSK',
              players: [
                {
                  id: 10,
                  role: 'Bowler',
                },
              ],
            },
          ],
        },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [Livepage],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Livepage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate player runs', () => {
    expect(component.playerruns('1')).toBe(1);
    expect(component.playerruns('4')).toBe(4);
    expect(component.playerruns('6')).toBe(6);
    expect(component.playerruns('0')).toBe(0);
  });

  it('should add ball', () => {
    component.addball('4');

    expect(mockLiveService.addBall)
      .toHaveBeenCalledWith('4');
  });

  it('should calculate required runs', () => {
    mockLiveService.innings = signal(2);

    component.live = {
      teams: [
        {
          scores: 100,
          overs: 10,
        },
        {
          scores: 0,
          overs: 0,
        },
      ],
    } as any;
    mockLiveService.live = {
  teams: [
    {
      scores: 100,
      overs: 10,
    },
    {
      scores: 0,
      overs: 0,
    },
  ],
};

    component.requiredRun();

    expect(component.target).toBe(181);
  });

  it('should redirect to second innings', () => {
    component.startSecondInnings();

    expect(mockLiveService.startSecondInnings)
      .toHaveBeenCalled();
  });

  it('should handle wicket with no next player', () => {
    component.striker = {
      status: 'Not Out',
    } as any;

    component.live = {
      teams: [
        {
          wickets: 0,
          players: [],
        },
      ],
    } as any;

    const result = component.handleWicket();

    expect(result).toBeNull();
  });
});