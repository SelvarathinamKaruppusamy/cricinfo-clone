import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CompletedDetails } from './completed-details';
import { CompletedService } from '../../Services/completed-service';

describe('CompletedDetails', () => {
  let component: CompletedDetails;
  let fixture: ComponentFixture<CompletedDetails>;

  const mockCompletedService = {
    getCompletedMatches: vi.fn().mockReturnValue(
      of([
        {
          matchNo: 1,
          playerOfTheMatch: 'Virat',
          teams: [
            {
              teamId: 1,
              batting: [],
              bowling: [],
              matchStatus: [true],
            },
            {
              teamId: 2,
              batting: [],
              bowling: [],
              matchStatus: [false],
            },
          ],
        },
      ])
    ),
  };

  const mockHttpClient = {
    get: vi.fn().mockReturnValue(of([])),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              matchNo: 1,
            }),
          },
        },
        {
          provide: CompletedService,
          useValue: mockCompletedService,
        },
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    })
      .overrideComponent(CompletedDetails, {
        set: {
          template: '<div>Completed Details</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CompletedDetails);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});