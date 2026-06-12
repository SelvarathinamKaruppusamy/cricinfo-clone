import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Squads } from './squads';

describe('Squads', () => {
  let component: Squads;
  let fixture: ComponentFixture<Squads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Squads],
    }).compileComponents();

    fixture = TestBed.createComponent(Squads);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
