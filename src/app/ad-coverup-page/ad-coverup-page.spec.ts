import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCoverupPage } from './ad-coverup-page';

describe('AdCoverupPage', () => {
  let component: AdCoverupPage;
  let fixture: ComponentFixture<AdCoverupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCoverupPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdCoverupPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
