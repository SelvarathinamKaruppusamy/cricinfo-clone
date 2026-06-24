import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveUpdateAdmin } from './live-update-admin';

describe('LiveUpdateAdmin', () => {
  let component: LiveUpdateAdmin;
  let fixture: ComponentFixture<LiveUpdateAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveUpdateAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveUpdateAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
