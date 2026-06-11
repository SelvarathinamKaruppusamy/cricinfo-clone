import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMatchCard } from './live-match-card';

describe('LiveMatchCard', () => {
  let component: LiveMatchCard;
  let fixture: ComponentFixture<LiveMatchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMatchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveMatchCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
