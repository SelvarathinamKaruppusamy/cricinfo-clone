import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Livepage } from './livepage';
import { LiveService } from '../Services/live-service';
import { Animation } from '../Services/animation';

describe('Livepage', () => {
  let component: Livepage;
  let fixture: ComponentFixture<Livepage>;

  const liveSignal = signal({
    tossWinner: 'RCB',
    tossDecision: 'Bat',

    teams: [
      {
        teamId: 1,
        shortName: 'RCB',
        runs: 120,
        wickets: 2,
        overs: 10.3,
      },
      {
        teamId: 2,
        shortName: 'CSK',
        runs: 180,
        wickets: 8,
        overs: 20,
      },
    ],
  } as any);

  const mockLiveService = {
    live: liveSignal,

    players1: signal([
      { id: 1, name: 'Virat', status: 'Batting' },
      { id: 2, name: 'Faf', status: 'Batting' },
      { id: 3, name: 'Maxwell', status: 'Out' },
    ]),

    ball: signal(['1', '4', 'WD', '6']),

    innings: signal(1),

    currentBattingTeam: signal(1),

    currentBowlingTeam: signal(2),

    striker: { id: 1, name: 'Virat' },

    nonStriker: { id: 2, name: 'Faf' },

    currentBowler: { id: 10, name: 'Jadeja' },

    GetLiveMatch: vi.fn(() => of(liveSignal())),

    loadMatchIntoService: vi.fn(),
  };

  const mockAnimation = {
    show: vi.fn(),
    showWinner: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livepage],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
        {
          provide: Animation,
          useValue: mockAnimation,
        },
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(Livepage, {
        set: {
          template: '<div>Livepage</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Livepage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return current batters', () => {
    expect(component.currentbatters().length).toBe(2);
  });

  it('should return striker', () => {
    expect(component.striker()?.name).toBe('Virat');
  });

  it('should return non striker', () => {
    expect(component.nonStriker()?.name).toBe('Faf');
  });

  it('should return current bowler', () => {
    expect(component.currentBowler()?.name).toBe('Jadeja');
  });

  it('should return toss winner', () => {
    expect(component.toss()).toBe('RCB');
  });

  it('should return toss decision', () => {
    expect(component.tossDecision()).toBe('Bat');
  });

  it('should return current batting team', () => {
    expect(component.currentBatting()?.shortName).toBe('RCB');
  });

  it('should return current bowling team', () => {
    expect(component.currentBowling()?.shortName).toBe('CSK');
  });

  it('should calculate target in first innings', () => {
    expect(component.target()).toBe(0);
  });

  it('should calculate target in second innings', () => {
    mockLiveService.innings.set(2);

    expect(component.target()).toBe(181);
  });

  it('should calculate required runs', () => {
    mockLiveService.innings.set(2);

    expect(component.requiredRuns()).toBe(61);
  });

  it('should calculate remaining balls', () => {
    mockLiveService.innings.set(2);

    expect(component.remainingBalls()).toBe(57);
  });

  it('should detect match not won', () => {
    mockLiveService.innings.set(2);

    expect(component.matchWon()).toBe(false);
  });

  it('should return current over balls', () => {
    expect(component.currentBowlerBalls()).toEqual([
      '1',
      '4',
      'WD',
      '6',
    ]);
  });

  it('should start live polling', () => {
    component.startLivePolling();

    expect(mockLiveService.GetLiveMatch).toHaveBeenCalled();
  });

  it('should load match into service', () => {
    component.startLivePolling();

    expect(mockLiveService.loadMatchIntoService).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    component.startLivePolling();

    const spy = vi.spyOn(component.pollSub!, 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('should trigger animation for latest ball', () => {
    component.startLivePolling();

    expect(mockAnimation.show).toHaveBeenCalled();
  });
});