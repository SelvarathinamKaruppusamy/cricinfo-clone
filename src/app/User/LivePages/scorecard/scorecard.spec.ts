import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Scorecard } from './scorecard';
import { LiveService } from '../Services/live-service';

describe('Scorecard', () => {
  let component: Scorecard;
  let fixture: ComponentFixture<Scorecard>;

  const liveSignal = signal({
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
  } as any);

  const mockLiveService = {
    live: liveSignal,

    tosswin: signal(0),
    tossloss: signal(1),

    players1: signal<any[]>([]),
  };
  beforeEach(async () => {
    liveSignal.set({
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
    } as any);

    mockLiveService.tosswin.set(0);
    mockLiveService.tossloss.set(1);
    mockLiveService.players1.set([]);

    // existing TestBed code...
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scorecard],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
      ],
    })
      .overrideComponent(Scorecard, {
        set: {
          template: '<div>Scorecard</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Scorecard);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return live match', () => {
    expect(component.live()).toEqual(liveSignal());
  });

  it('should return first innings team', () => {
    expect(component.firstInningsTeam()?.shortName).toBe('CSK');
  });

  it('should return second innings team', () => {
    expect(component.secondInningsTeam()?.shortName).toBe('MI');
  });

  it('should return first innings batters', () => {
    expect(component.firstInningsBatters()?.length).toBe(1);
    expect(component.firstInningsBatters()?.[0].name).toBe('Dhoni');
  });

  it('should return first innings bowlers', () => {
    expect(component.firstInningsBowlers()?.length).toBe(1);
    expect(component.firstInningsBowlers()?.[0].name).toBe('Rohit');
  });

  it('should return second innings batters', () => {
    expect(component.secondInningsBatters()?.length).toBe(1);
    expect(component.secondInningsBatters()?.[0].name).toBe('Rohit');
  });

  it('should return second innings bowlers', () => {
    expect(component.secondInningsBowlers()?.length).toBe(1);
    expect(component.secondInningsBowlers()?.[0].name).toBe('Dhoni');
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

  it('should update first innings team when toss winner changes', () => {
    mockLiveService.tosswin.set(1);
    mockLiveService.tossloss.set(0);

    expect(component.firstInningsTeam()?.shortName).toBe('MI');
    expect(component.secondInningsTeam()?.shortName).toBe('CSK');
  });

  it('should update live data when signal changes', () => {
    liveSignal.set({
      teams: [
        {
          shortName: 'RCB',
          players: [{ name: 'Virat' }],
        },
        {
          shortName: 'GT',
          players: [{ name: 'Gill' }],
        },
      ],
    } as any);

    expect(component.firstInningsTeam()?.shortName).toBe('RCB');
    expect(component.secondInningsTeam()?.shortName).toBe('GT');
  });
});
