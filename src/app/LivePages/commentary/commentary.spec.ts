import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Commentary } from './commentary';
import { LiveService } from '../Services/live-service';

describe('Commentary', () => {
  let component: Commentary;
  let fixture: ComponentFixture<Commentary>;

  const mockLiveService: any = {
    live: {
      teams: [
        { shortName: 'RCB' },
        { shortName: 'CSK' },
      ],
    },

    currentBattingTeam: signal(0),

    ball: signal(['1', '4', '0', '6', 'Wd', '2']),

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load live data on init', () => {
    component.ngOnInit();

    expect(component.live).toEqual(mockLiveService.live);
  });

  it('should build commentary', () => {
    component.buildCommentary();

    expect(component.commentaryLog.length).toBeGreaterThan(0);
  });

  it('should calculate over scores', () => {
    component.buildCommentary();

    expect(component.overscores.length).toBeGreaterThan(0);
  });

  it('should calculate cumulative scores', () => {
    component.buildCommentary();

    expect(component.cumulativeScores.length).toBeGreaterThan(0);
  });
});