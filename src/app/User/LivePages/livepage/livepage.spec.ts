import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Livepage } from './livepage';
import { LiveService } from '../Services/live-service';

describe('Livepage', () => {
  let component: Livepage;
  let fixture: ComponentFixture<Livepage>;

  const liveSignal = signal({
    tossWinner: 'RCB',
    tossDecision: 'Bat',
    teams: [
      {
        shortName: 'RCB',
        scores: 120,
        wickets: 2,
        overs: 10.3,
        players: [
          { id: 1, name: 'Virat', status: 'Not Out' },
          { id: 2, name: 'Faf', status: 'Not Out' },
        ],
      },
      {
        shortName: 'CSK',
        scores: 0,
        wickets: 0,
        overs: 0,
        players: [{ id: 10, name: 'Jadeja', role: 'Bowler' }],
      },
    ],
  } as any);

  const mockLiveService = {
    live: liveSignal,

    players1: signal([
      { id: 1, name: 'Virat', status: 'Not Out' },
      { id: 2, name: 'Faf', status: 'Not Out' },
    ]),

    ball: signal(['1', '4', 'Wd', '6']),

    innings: signal(1),

    tosswin: signal(0),
    tossloss: signal(1),

    currentBattingTeam: signal(0),
    currentBowlingTeam: signal(1),

    striker: { id: 1, name: 'Virat' },
    nonStriker: { id: 2, name: 'Faf' },
    currentBowler: { id: 10, name: 'Jadeja' },

    tossDecision: signal('Bat'),

    completedBattingTeam: {
      scores: 180,
    },

    GetLiveMatches: vi.fn(() => of([liveSignal()])),

    loadMatchIntoService: vi.fn(),

    startSecondInnings: vi.fn(),

    processBall: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livepage],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
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

  it('should call processBall()', () => {
    component.addball('4');

    expect(mockLiveService.processBall).toHaveBeenCalledWith('4');
  });

  it('should ignore empty ball', () => {
    component.addball('');

    expect(mockLiveService.processBall).not.toHaveBeenCalled();
  });

  it('should start second innings', () => {
    component.startSecondInnings();

    expect(mockLiveService.startSecondInnings).toHaveBeenCalled();
  });

  it('should calculate target as 0 in first innings', () => {
    expect(component.target()).toBe(0);
  });

  it('should calculate required runs in second innings', () => {
    mockLiveService.innings.set(2);

    expect(component.target()).toBe(181);
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

  it('should call loadMatchIntoService while polling', () => {
    component.startLivePolling();

    expect(mockLiveService.GetLiveMatches).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    component.startLivePolling();

    const spy = vi.spyOn(component.pollSub!, 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
