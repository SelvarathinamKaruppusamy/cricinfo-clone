import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

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

  afterEach(() => {
    component.ngOnDestroy();
    vi.restoreAllMocks();
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

  it('should have Playoff news', () => {
    expect(component.iplNews[2].title).toContain('Playoff');
  });

  it('should return current news', () => {
    component.currentIndex = 0;

    expect(component.currentNews.title).toContain('Kohli');
  });

  it('should move to next slide', () => {
    component.currentIndex = 0;

    component.nextSlide();

    expect(component.currentIndex).toBe(1);
  });

  it('should wrap to first slide after last slide', () => {
    component.currentIndex = component.iplNews.length - 1;

    component.nextSlide();

    expect(component.currentIndex).toBe(0);
  });

  it('should move to previous slide', () => {
    component.currentIndex = 1;

    component.previousSlide();

    expect(component.currentIndex).toBe(0);
  });

  it('should wrap to last slide when previous is called on first slide', () => {
    component.currentIndex = 0;

    component.previousSlide();

    expect(component.currentIndex).toBe(component.iplNews.length - 1);
  });

  it('should go to selected slide', () => {
    component.goToSlide(2);

    expect(component.currentIndex).toBe(2);
  });

  it('should clear interval on destroy', () => {
    const spy = vi.spyOn(globalThis, 'clearInterval');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });
});
