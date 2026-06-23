import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { Nav } from './nav';
import { NavService } from './nav-service';

describe('Nav', () => {
  let component: Nav;
  let fixture: ComponentFixture<Nav>;

  const mockRouter = {
    navigateByUrl: vi.fn(),
  };

  const mockNavService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: NavService,
          useValue: mockNavService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain navigation items', () => {
    expect(component.items.length).toBe(5);
  });

  it('should navigate to route', () => {
    component.getMethod('/upcoming');

    expect(component.activateRoute).toBe('/upcoming');

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/upcoming');
  });

  it('should navigate to completed page', () => {
    component.getMethod('/completed');

    expect(component.activateRoute).toBe('/completed');

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/completed');
  });
});
