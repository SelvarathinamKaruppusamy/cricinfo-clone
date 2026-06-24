import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TossPanel } from './toss-panel';

describe('TossPanel', () => {
  let component: TossPanel;
  let fixture: ComponentFixture<TossPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TossPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TossPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
