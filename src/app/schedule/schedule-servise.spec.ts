import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ScheduleServise } from './schedule-servise';

describe('ScheduleServise', () => {
  let service: ScheduleServise;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ScheduleServise);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch live matches', () => {
    const mockData = [{ id: 1 }];

    service.getLiveMatches().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/matches'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockData);
  });

  it('should fetch upcoming matches', () => {
    const mockData = [{ id: 2 }];

    service.getUpcomingMatches().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'http://localhost:5000/matches'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockData);
  });

  it('should fetch completed matches', () => {
    const mockData = [{ id: 3 }];

    service.getCompletedMatches().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'http://localhost:7000/completed'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockData);
  });
});