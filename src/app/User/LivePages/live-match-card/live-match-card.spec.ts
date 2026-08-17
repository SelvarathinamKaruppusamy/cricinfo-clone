import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { LiveMatchCard } from './live-match-card';
import { LiveService } from '../Services/live-service';
import { UpcService } from '../../UpCommingPage/up-comp/upc-service';
import { CompletedService } from '../../Completed/Services/completed-service';
import { AdminService } from '../../../Admin/LiveAdmin/admin-service';
describe('LiveMatchCard', () => {
  let component: LiveMatchCard;
  let fixture: ComponentFixture<LiveMatchCard>;
  const mockAdminService = {};
  const mockRouter = {
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
  };
  const liveSignal = signal({
    id: 1,
    innings: 1,
    teams: [
      {
        shortName: 'RCB',
        scores: 100,
        overs: 10,
        players: [],
      },
      {
        shortName: 'CSK',
        scores: 0,
        overs: 0,
        players: [],
      },
    ],
  } as any);

  const mockLiveService = {
    ball: signal([]),

    innings: signal(1),

    currentBattingTeam: signal(0),

    completedBattingTeam: {
      scores: 180,
    },

    live: liveSignal,

    loadMatchIntoService: vi.fn(),

    GetLiveMatches: vi.fn().mockReturnValue(
      of([
        {
          id: 1,
          innings: 1,
          teams: [
            {
              shortName: 'RCB',
              scores: 100,
              overs: 10,
              players: [],
            },
            {
              shortName: 'CSK',
              scores: 0,
              overs: 0,
              players: [],
            },
          ],
        },
      ]),
    ),
  };

  const mockUpcService = {
    getMatch: vi.fn().mockReturnValue(
      of([
        {
          id: 1,
          teams: [
            {
              players: [],
            },
            {
              players: [],
            },
          ],
        },
      ]),
    ),
  };

  const mockCompletedService = {
    getCompletedMatches: vi.fn().mockReturnValue(
      of([
        {
          matchNo: 1,
          teams: [
            {
              teamId: 1,
              shortName: 'RCB',
              players: [],
            },
            {
              teamId: 2,
              shortName: 'CSK',
              players: [],
            },
          ],
        },
      ]),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMatchCard],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: LiveService, useValue: mockLiveService },
        { provide: UpcService, useValue: mockUpcService },
        { provide: CompletedService, useValue: mockCompletedService },
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMatchCard);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter matches', () => {
    component.matchs = [
      {
        teams: [{ teamId: 1 }],
      } as any,
      {
        teams: [{ teamId: 2 }],
      } as any,
    ];

    component.matchFilter(1);

    expect(component.filteredMatches.length).toBe(1);
  });

  it('should reset filters', () => {
    component.changebutton();

    expect(component.trackflag).toBe(true);
    expect(component.trackflag1).toBe(true);
    expect(component.selectedTeamId).toBe(0);
  });

  it('should change button state', () => {
    component.changebutton1();

    expect(component.trackflag).toBe(false);
    expect(component.trackflag1).toBe(true);
  });

  it('should navigate to live page', () => {
    component.movetolivepage();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/live/livepage');
  });

  it('should navigate to completed page', () => {
    component.completedpage(5);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/live/completed', 5]);
  });

  it('should navigate to points table', () => {
    const event = {
      stopPropagation: vi.fn(),
    } as any;

    component.table(event, 10);

    expect(event.stopPropagation).toHaveBeenCalled();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/live/points-table', 10]);
  });

  it('should calculate required runs', () => {
    mockLiveService.innings.set(2);

    liveSignal.set({
      id: 1,
      innings: 2,
      teams: [
        {
          shortName: 'RCB',
          scores: 100,
          overs: 10,
          players: [],
        },
        {
          shortName: 'CSK',
          scores: 0,
          overs: 0,
          players: [],
        },
      ],
    } as any);

    component.requiredRun();

    expect(component.target).toBe(181);
    expect(component.requiredRuns).toBe(81);
    expect(component.remainingBalls).toBe(60);
  });
  it('should navigate to upcoming page', () => {
    component.upcommingdata = {
      id: 5,
    } as any;

    component.movetoupcommingpage();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/live/match/5');
  });
  it('should navigate to schedule page', () => {
    const event = {
      stopPropagation: vi.fn(),
    } as any;

    component.schedulepage(event, 2);

    expect(event.stopPropagation).toHaveBeenCalled();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/live/schedule', 2]);
  });
});
