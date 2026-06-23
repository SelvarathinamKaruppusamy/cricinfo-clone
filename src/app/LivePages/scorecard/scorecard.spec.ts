import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Scorecard } from './scorecard';
import { LiveService } from '../Services/live-service';

describe('Scorecard', () => {
  let component: Scorecard;
  let fixture: ComponentFixture<Scorecard>;

  const mockLiveService: any = {
    live: {
      teams: [
        {
          shortName: 'CSK',
          players: [{ name: 'Dhoni' }],
        },
        {
          shortName: 'MI',
          players: [{ name: 'Rohit' }],
        },
      ],
    },

    tosswin: signal(0),
    tossloss: signal(1),

    players1: signal([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scorecard],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Scorecard);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load live data on init', () => {
    component.ngOnInit();

    expect(component.live).toEqual(mockLiveService.live);
  });

  it('should return first innings team', () => {
    component.ngOnInit();

    expect(component.firstInningsTeam().shortName).toBe('CSK');
  });

  it('should return second innings team', () => {
    component.ngOnInit();

    expect(component.secondInningsTeam().shortName).toBe('MI');
  });

  it('should return first innings batters', () => {
    component.ngOnInit();

    expect(component.firstInningsBatters().length).toBe(1);
  });

  it('should return second innings batters', () => {
    component.ngOnInit();

    expect(component.secondInningsBatters().length).toBe(1);
  });

  it('should detect second innings not started', () => {
    expect(component.secondInningsStarted()).toBe(false);
  });

  it('should detect second innings started', () => {
    mockLiveService.players1.set([
      {
        name: 'Virat',
      },
    ]);

    expect(component.secondInningsStarted()).toBe(true);
  });
});