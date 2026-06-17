import { TestBed } from '@angular/core/testing';

import { ScheduleServise } from './schedule-servise';

describe('ScheduleServise', () => {
  let service: ScheduleServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
