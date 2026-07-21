import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upcome } from './upcome';

describe('Upcome', () => {
  let component: Upcome;
  let fixture: ComponentFixture<Upcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upcome],
    }).compileComponents();

    fixture = TestBed.createComponent(Upcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
