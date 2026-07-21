import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAnimation } from './live-animation';

describe('LiveAnimation', () => {
  let component: LiveAnimation;
  let fixture: ComponentFixture<LiveAnimation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAnimation],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveAnimation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
