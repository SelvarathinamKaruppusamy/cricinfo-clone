import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BlogDetails } from './blog-details';

describe('BlogDetails', () => {
  let component: BlogDetails;
  let fixture: ComponentFixture<BlogDetails>;

  const mockHttpClient = {
    get: vi.fn().mockReturnValue(
      of({
        id: 1,
        title: 'IPL Final',
        shortDescription: 'RCB won',
        image: 'sample.jpg',
        content: ['Test content'],
        tags: ['IPL'],
      })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetails],
      providers: [
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({
                id: '1',
              })
            ),
          },
        },
      ],
    })
      .overrideComponent(BlogDetails, {
        set: {
          template: '<div>Blog Details</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogDetails);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});