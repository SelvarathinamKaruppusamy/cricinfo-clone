import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpComp } from './up-comp';
import { UpcService } from './upc-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('UpComp', () => {
  let component: UpComp;
  let fixture: ComponentFixture<UpComp>;

  const mockUpcService = {
    getMatch: vi.fn(),
    upCommingdata: null,
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpComp],
      providers: [
        { provide: UpcService, useValue: mockUpcService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpComp);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load matches on ngOnInit', () => {
    const mockMatches = [
      {
        id: 1,
        status: 'Upcoming',
        matchNo: 1,
        city: 'Chennai',
        venue: 'Chepauk',
        date: '2025-03-22',
        teams: [
          {
            teamId: 1,
            shortName: 'CSK',
            fullName: 'Chennai Super Kings',
          },
          {
            teamId: 2,
            shortName: 'MI',
            fullName: 'Mumbai Indians',
          },
        ],
      },
    ];

    mockUpcService.getMatch.mockReturnValue(of(mockMatches));

    component.ngOnInit();

    expect(component.cards.length).toBe(1);
    expect(component.cards[0].city).toBe('Chennai');
    expect(mockUpcService.upCommingdata).toEqual(component.cards[0]);
  });

  it('should navigate to match page', () => {
    component.open(10);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/match', 10]);
  });

  it('should navigate to schedule page', () => {
    const event = {
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component.schedulepage(event, 5);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/schedule', 5]);
  });

  it('should format date correctly', () => {
    const result = component.formatDate('2025-06-23');

    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(23);
  });
});