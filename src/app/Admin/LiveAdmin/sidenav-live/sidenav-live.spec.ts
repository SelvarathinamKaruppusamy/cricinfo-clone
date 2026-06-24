import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavLive } from './sidenav-live';

describe('SidenavLive', () => {
  let component: SidenavLive;
  let fixture: ComponentFixture<SidenavLive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavLive],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavLive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
