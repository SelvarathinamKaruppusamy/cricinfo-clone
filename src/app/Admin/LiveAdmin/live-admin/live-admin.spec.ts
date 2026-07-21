import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { LiveAdmin } from './live-admin';

describe('LiveAdmin', () => {
  let component: LiveAdmin;
  let fixture: ComponentFixture<LiveAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAdmin],
    })
      .overrideComponent(LiveAdmin, {
        set: {
          template: '<div>Live Admin</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LiveAdmin);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
