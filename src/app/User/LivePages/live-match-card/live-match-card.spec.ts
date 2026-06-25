import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { LiveMatchCard } from './live-match-card';
import { LiveService } from '../Services/live-service';
import { UpcService } from '../../UpCommingPage/up-comp/upc-service';
import { CompletedService } from '../../Completed/Services/completed-service';

describe('LiveMatchCard', () => {
  let component: LiveMatchCard;
  let fixture: ComponentFixture<LiveMatchCard>;

  const mockRouter = {
    navigate: vi.fn(),
    navigateByUrl: vi.fn(),
  };

  const mockLiveService: any = {
    ball: signal([]),
    innings: signal(1),
    tossloss: vi.fn(() => 1),
    currentBattingTeam: signal(0),
    completedBattingTeam: {
      scores: 180,
    },
    live: {
      teams: [
        { scores: 100, overs: 10 },
        { scores: 0, overs: 0 },
      ],
    },
    GetLiveMatches: vi.fn().mockReturnValue(
      of([
        {
          teams: [{ shortName: 'RCB' }, { shortName: 'CSK' }],
        },
      ]),
    ),
  };

  const mockUpcService = {
    getMatch: vi.fn().mockReturnValue(
      of([
        {
          id: 1,
          teams: [{}, {}],
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
            { teamId: 1, shortName: 'RCB' },
            { teamId: 2, shortName: 'CSK' },
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMatchCard);
    component = fixture.componentInstance;
  });

  afterEach(() => {
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

    component.live = {
      teams: [
        { scores: 100, overs: 10 },
        { scores: 0, overs: 0 },
      ],
    } as any;

    component.requiredRun();

    expect(component.target).toBe(181);
  });
});
