import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Stats } from './stats';
import { CompletedService } from '../Completed/Services/completed-service';

describe('Stats', () => {
  let component: Stats;
  let fixture: ComponentFixture<Stats>;

  const mockCompletedService = {
    getCompletedMatches: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ type: 'player' }),
          },
        },
        {
          provide: CompletedService,
          useValue: mockCompletedService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Stats);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load route param', () => {
    mockCompletedService.getCompletedMatches.mockReturnValue(of([]));

    component.ngOnInit();

    expect(component.statType).toBe('player');
  });

  it('should load completed matches', () => {
    const mockData = [
      {
        teams: [],
      },
    ];

    mockCompletedService.getCompletedMatches.mockReturnValue(of(mockData));

    component.loadCompletedMatches();

    expect(component.matches).toEqual(mockData);
  });

  it('should load unique teams', () => {
    component.matches = [
      {
        teams: [
          { teamId: 1, shortName: 'CSK' },
          { teamId: 2, shortName: 'MI' },
        ],
      },
      {
        teams: [{ teamId: 1, shortName: 'CSK' }],
      },
    ];

    component.loadTeams();

    expect(component.teams.length).toBe(2);
  });

  it('should return players for team', () => {
    component.matches = [
      {
        teams: [
          {
            teamId: 1,
            batting: [
              {
                id: 1,
                name: 'Virat',
              },
            ],
          },
        ],
      },
    ];

    const players = component.getPlayersForTeam(1);

    expect(players.length).toBe(1);
    expect(players[0].name).toBe('Virat');
  });

  it('should format player stats', () => {
    component.selectedPlayer = {
      id: 1,
      name: 'Virat',
      role: 'Batter',
    };

    component.selectedTeam = {
      shortName: 'RCB',
    };

    component.matches = [
      {
        matchNo: 1,
        playerOfTheMatch: 'Virat',
        teams: [
          {
            teamId: 1,
            shortName: 'RCB',
            batting: [
              {
                id: 1,
                name: 'Virat',
                runs: 100,
                balls: 50,
                fours: 10,
                sixes: 5,
              },
            ],
            bowling: [],
          },
          {
            teamId: 2,
            shortName: 'CSK',
          },
        ],
      },
    ];

    component.calculatePlayerStats();

    expect(component.playerStats.runs).toBe(100);
    expect(component.playerStats.matches).toBe(1);
    expect(component.playerStats.highestScore).toBe(100);
    expect(component.playerStats.potmAwards).toBe(1);
  });

  it('should calculate orange cap list', () => {
    component.matches = [
      {
        teams: [
          {
            batting: [
              {
                id: 1,
                name: 'Virat',
                runs: 100,
                balls: 50,
              },
            ],
          },
        ],
      },
    ];

    component.calculateOrangeCap();

    expect(component.orangeCapList.length).toBe(1);
    expect(component.orangeCapList[0].runs).toBe(100);
  });

  it('should calculate purple cap list', () => {
    component.matches = [
      {
        teams: [
          {
            bowling: [
              {
                id: 1,
                name: 'Bumrah',
                wickets: 4,
                ballsBowled: 24,
                runsConceded: 20,
              },
            ],
          },
        ],
      },
    ];

    component.calculatePurpleCap();

    expect(component.purpleCapList.length).toBe(1);
    expect(component.purpleCapList[0].wickets).toBe(4);
  });
});
