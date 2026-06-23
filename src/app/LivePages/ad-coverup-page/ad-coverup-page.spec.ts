import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { AdCoverupPage } from './ad-coverup-page';

describe('AdCoverupPage', () => {
  let component: AdCoverupPage;
  let fixture: ComponentFixture<AdCoverupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCoverupPage],
    })
      .overrideComponent(AdCoverupPage, {
        set: {
          template: '<div>Ad Coverup</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdCoverupPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain 3 IPL news items', () => {
    expect(component.iplNews.length).toBe(3);
  });

  it('should have Virat news', () => {
    expect(component.iplNews[0].title).toContain('Kohli');
  });

  it('should have Dhoni news', () => {
    expect(component.iplNews[1].title).toContain('Thala');
  });

  it('should have playoffs news', () => {
    expect(component.iplNews[2].title).toContain('Playoffs');
  });
});