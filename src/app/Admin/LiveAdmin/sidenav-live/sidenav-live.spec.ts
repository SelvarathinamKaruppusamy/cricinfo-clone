import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { SidenavLive } from './sidenav-live';
import { LiveService } from '../../../User/LivePages/Services/live-service';
import { AdminService } from '../../admin-login/admin-service';

describe('SidenavLive', () => {
  let component: SidenavLive;
  let fixture: ComponentFixture<SidenavLive>;

  const mockLiveService = {
    innings: signal(1),
  };

  const mockAdminService = {
    getCurrentUser: vi.fn().mockReturnValue({
      username: 'admin',
      role: 'Admin',
    }),
    logout: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavLive],
      providers: [
        {
          provide: LiveService,
          useValue: mockLiveService,
        },
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    })
      .overrideComponent(SidenavLive, {
        set: {
          template: '<div>Sidenav Live</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SidenavLive);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    component.ngOnInit();

    expect(mockAdminService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual({
      username: 'admin',
      role: 'Admin',
    });
  });

  it('should return innings from signal', () => {
    expect(component.innings()).toBe(1);
  });

  it('should update innings when signal changes', () => {
    mockLiveService.innings.set(2);

    expect(component.innings()).toBe(2);
  });

  it('should logout and navigate to admin page', () => {
    component.logout();

    expect(mockAdminService.logout).toHaveBeenCalled();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
