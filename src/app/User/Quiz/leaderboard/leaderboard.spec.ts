import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderBoard } from './leaderboard';

describe('Leaderboard', () => {
  let component: LeaderBoard;
  let fixture: ComponentFixture<LeaderBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
