import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Commentary } from './commentary';
import { LiveService } from '../Services/live-service';

describe('Commentary', () => {
  let component: Commentary;
  let fixture: ComponentFixture<Commentary>;

  const liveSignal = signal({
    teams: [{ shortName: 'RCB' }, { shortName: 'CSK' }],
  } as any);

  const ballSignal = signal(['1', '4', '0', '6', 'Wd', '2']);

  const mockLiveService = {
    live: liveSignal,

    currentBattingTeam: signal(0),

    ball: ballSignal,

    calculateScore: vi.fn((ball: string) => {
      switch (ball) {
        case '1':
        case 'Wd':
        case 'Nb':
          return 1;
        case '2':
          return 2;
        case '3':
          return 3;
        case '4':
          return 4;
        case '6':
          return 6;
        default:
          return 0;
      }
    }),
  };

  beforeEach(async () => {
    ballSignal.set(['1', '4', '0', '6', 'Wd', '2']);

    liveSignal.set({
      teams: [{ shortName: 'RCB' }, { shortName: 'CSK' }],
    } as any);

    mockLiveService.currentBattingTeam.set(0);

    mockLiveService.calculateScore.mockClear();
    await TestBed.configureTestingModule({
      imports: [Commentary],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
      ],
    })
      .overrideComponent(Commentary, {
        set: {
          template: '<div>Commentary</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Commentary);
    component = fixture.componentInstance;

    fixture.detectChanges();
    mockLiveService.calculateScore.mockClear();
  });
  afterEach(() => {
    mockLiveService.calculateScore.mockClear();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load live data on ngOnInit', () => {
    component.ngOnInit();

    expect(component.live).toEqual(liveSignal());
  });

  it('should build commentary from balls', () => {
    component.buildCommentary(ballSignal());

    expect(component.commentaryLog.length).toBeGreaterThan(0);
  });

  it('should calculate over scores', () => {
    component.buildCommentary(ballSignal());

    expect(component.overscores.length).toBeGreaterThan(0);
  });

  it('should calculate cumulative scores', () => {
    component.buildCommentary(ballSignal());

    expect(component.cumulativeScores.length).toBeGreaterThan(0);
  });

  it('should call calculateScore for every ball', () => {
    component.buildCommentary(ballSignal());

    expect(mockLiveService.calculateScore).toHaveBeenCalledTimes(6);
  });

  it('should create one incomplete over when less than six legal balls', () => {
    component.buildCommentary(ballSignal());

    expect(component.commentaryLog.length).toBe(1);
  });

  it('should rebuild commentary when balls change', () => {
    const balls = ['4', '6'];

    component.buildCommentary(balls);

    expect(component.commentaryLog.length).toBe(1);
    expect(component.cumulativeScores[0]).toBe(10);
  });

  it('should handle empty ball array', () => {
    component.buildCommentary([]);

    expect(component.commentaryLog).toEqual([]);
    expect(component.overscores).toEqual([]);
    expect(component.cumulativeScores).toEqual([]);
  });

  it('should expose batting team through computed signal', () => {
    expect(component.battingTeam()?.shortName).toBe('RCB');
  });
});
