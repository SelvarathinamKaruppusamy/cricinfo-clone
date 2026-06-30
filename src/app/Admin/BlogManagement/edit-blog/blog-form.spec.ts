import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { BlogForm } from './blog-form';
import { BlogManagementService } from '../services/blog-management';

describe('BlogForm', () => {
  let component: BlogForm;
  let fixture: ComponentFixture<BlogForm>;

  const mockRouter = {
    navigate: vi.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: vi.fn().mockReturnValue(null),
      },
    },
  };

  const mockBlogService = {
    getBlogs: vi.fn().mockReturnValue(of([])),
    updateBlog: vi.fn().mockReturnValue(of({})),
  };

  const mockHttp = {
    post: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogForm],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
        {
          provide: BlogManagementService,
          useValue: mockBlogService,
        },
        {
          provide: HttpClient,
          useValue: mockHttp,
        },
      ],
    })
      .overrideComponent(BlogForm, {
        set: {
          template: '<div>Blog Form</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.blogForm).toBeTruthy();
  });

  it('should generate slug', () => {
    expect(component.generateSlug('IPL Final 2026')).toBe('ipl-final-2026');
  });

  it('should update slug when title changes', () => {
    component.blogForm.patchValue({
      title: 'RCB Wins IPL',
    });

    component.onTitleChange();

    expect(component.blogForm.value.slug).toBe('rcb-wins-ipl');
  });

  it('should navigate on cancel', () => {
    component.cancel();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/navbarAdmin/blogs']);
  });

  it('should close toast', () => {
    component.toastVisible = true;

    component.closeToast();

    expect(component.toastVisible).toBe(false);
  });

  it('should show success toast', () => {
    component.showToast('Saved', 'success');

    expect(component.toastVisible).toBe(true);
    expect(component.toastMessage).toBe('Saved');
    expect(component.toastType).toBe('success');
  });

  it('should mark form touched when invalid', () => {
    const spy = vi.spyOn(component.blogForm, 'markAllAsTouched');

    component.saveBlog();

    expect(spy).toHaveBeenCalled();
  });
});
