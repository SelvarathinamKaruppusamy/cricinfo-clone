import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Statistics } from './statistics';
import { LiveService } from '../Services/live-service';
import { vi } from 'vitest';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;

  const mockLiveService: any = {
    ball: vi.fn(() => []),

    calculateScore: vi.fn((ball: string) => {
      if (ball === 'Wd' || ball === 'Nb') return 1;
      if (ball === 'W') return 0;
      return Number(ball) || 0;
    }),

    completedBatters: vi.fn(() => []),

    firstInningsBalls: vi.fn(() => []),

    secondInningsBalls: vi.fn(() => []),

    players1: vi.fn(() => []),

    bowlers1: vi.fn(() => []),

    currentBowlerIndex: vi.fn(() => 0),

    tosswin: vi.fn(() => 0),

    tossloss: vi.fn(() => 1),

    innings: vi.fn(() => 1),

    GetLiveMatches: vi.fn(),

    completedBattingTeam: {
      scores: 180,
    },

    live: {
      teams: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statistics],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Statistics);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert ball number to over', () => {
    expect(component.convertBallToOver(7)).toBe('1.1');
  });

  it('should calculate runs progress', () => {
    const result = component.calculateRunsProgress([
      '1',
      '2',
      '4',
    ]);

    expect(result).toEqual([1, 3, 7]);
  });

  it('should calculate partnership', () => {
    mockLiveService.players1.mockReturnValue([
      {
        status: 'Not Out',
        runs: 40,
        balls: 20,
      },
      {
        status: 'Not Out',
        runs: 30,
        balls: 15,
      },
    ]);

    component.calculatePartnership();

    expect(component.partnershipRuns).toBe(70);
    expect(component.partnershipBalls).toBe(35);
  });

  it('should calculate statistics', () => {
    mockLiveService.ball.mockReturnValue([
      '1',
      '4',
      '0',
      'Wd',
      '6',
    ]);

    component.calculateStatistics();

    expect(component.totalRuns).toBeGreaterThan(0);
    expect(component.boundaries).toBe(2);
    expect(component.dotBalls).toBe(1);
    expect(component.extras).toBe(1);
  });
});