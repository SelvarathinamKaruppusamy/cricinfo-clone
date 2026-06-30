import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import { CompletedList } from './completed-list';
import { CompletedService } from '../../Services/completed-service';

describe('CompletedList', () => {
  let component: CompletedList;
  let fixture: ComponentFixture<CompletedList>;

  const mockCompletedService = {
    getCompletedMatches: vi.fn().mockReturnValue(
      of([
        {
          matchNo: 1,
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
          playerOfTheMatch: 'Virat',
        },
      ]),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedList],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('1'),
              },
            },
          },
        },
        {
          provide: CompletedService,
          useValue: mockCompletedService,
        },
      ],
    })
      .overrideComponent(CompletedList, {
        set: {
          template: '<div>Completed List</div>',
          styles: [''],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CompletedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
