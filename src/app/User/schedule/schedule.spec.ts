import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { Schedule } from './schedule';
import { ScheduleServise } from './schedule-servise';
import { UpcService } from '../UpCommingPage/up-comp/upc-service';
import { LiveService } from '../LivePages/Services/live-service';
import { CompletedService } from '../Completed/Services/completed-service';

describe('Schedule', () => {
  let component: Schedule;
  let fixture: ComponentFixture<Schedule>;

  const mockUpcService = {
    getMatch: vi.fn(),
  };

  const mockLiveService = {
    GetLiveMatches: vi.fn(),
  };

  const mockCompletedService = {
    getCompletedMatches: vi.fn(),
  };

  const mockScheduleService = {};

  const mockMatch = {
    id: 1,
    status: 'Live',
    matchNo: 1,
    city: 'Chennai',
    venue: 'Chepauk',
    date: '2025-06-23',
    result: 'CSK won',
    teams: [
      {
        shortName: 'CSK',
        scores: '180/4',
        overs: '20',
      },
      {
        shortName: 'MI',
        scores: '175/8',
        overs: '20',
      },
    ],
  };

  beforeEach(async () => {
    mockUpcService.getMatch.mockReturnValue(of([]));
    mockLiveService.GetLiveMatches.mockReturnValue(of([]));
    mockCompletedService.getCompletedMatches.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Schedule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
          },
        },
        {
          provide: UpcService,
          useValue: mockUpcService,
        },
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
        {
          provide: CompletedService,
          useValue: mockCompletedService,
        },
        {
          provide: ScheduleServise,
          useValue: mockScheduleService,
        },
      ],
    })
      .overrideComponent(Schedule, {
        set: {
          template: '<div>Schedule</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Schedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load route param id', () => {
    component.ngOnInit();

    expect(component.selectedMatchId).toBe(1);
  });

  it('should map match correctly', () => {
    const result = component.mapMatch(mockMatch);

    expect(result.id).toBe(1);
    expect(result.city).toBe('Chennai');
    expect(result.team1.shortName).toBe('CSK');
    expect(result.team2.shortName).toBe('MI');
    expect(result.result).toBe('CSK won');
  });

  it('should load live matches', () => {
    mockLiveService.GetLiveMatches.mockReturnValue(of([mockMatch]));

    component.ngOnInit();

    expect(component.live.length).toBe(1);
  });

  it('should load upcoming matches', () => {
    mockUpcService.getMatch.mockReturnValue(of([mockMatch]));

    component.ngOnInit();

    expect(component.upcoming.length).toBe(1);
  });

  it('should load completed matches', () => {
    mockCompletedService.getCompletedMatches.mockReturnValue(of([mockMatch]));

    component.ngOnInit();

    expect(component.completed.length).toBe(1);
  });

  it('should call scrollIntoView when element exists', () => {
    component.selectedMatchId = 1;

    const element = document.createElement('div');

    element.scrollIntoView = vi.fn();

    vi.spyOn(document, 'getElementById').mockReturnValue(element);

    component.scrollToSelectedMatch();

    expect(element.scrollIntoView).toHaveBeenCalled();
  });

  it('should not fail when element does not exist', () => {
    component.selectedMatchId = 1;

    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    expect(() => component.scrollToSelectedMatch()).not.toThrow();
  });
});
