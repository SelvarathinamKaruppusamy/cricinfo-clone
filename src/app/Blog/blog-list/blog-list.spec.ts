import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogList } from './blog-list';

describe('BlogList', () => {
  let component: BlogList;
  let fixture: ComponentFixture<BlogList>;

  const mockHttpClient = {
    get: vi.fn().mockReturnValue(
      of([
        {
          id: 1,
          title: 'IPL Final',
          shortDescription: 'RCB won the final',
          content: ['Virat played well'],
          tags: ['IPL', 'RCB'],
        },
      ]),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogList],
      providers: [
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
      ],
    })
      .overrideComponent(BlogList, {
        set: {
          template: '<div>Blog List</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogList);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
