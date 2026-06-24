import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAdmin } from './live-admin';

describe('LiveAdmin', () => {
  let component: LiveAdmin;
  let fixture: ComponentFixture<LiveAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
