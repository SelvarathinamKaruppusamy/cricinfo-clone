import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { LiveService } from './live-service';

describe('LiveService', () => {
  let service: LiveService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LiveService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(LiveService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateScore', () => {
    it('should return 0 for dot ball', () => {
      expect(service.calculateScore('0')).toBe(0);
    });

    it('should return 1 for single', () => {
      expect(service.calculateScore('1')).toBe(1);
    });

    it('should return 4 for boundary', () => {
      expect(service.calculateScore('4')).toBe(4);
    });

    it('should return 6 for six', () => {
      expect(service.calculateScore('6')).toBe(6);
    });

    it('should return 1 for wide', () => {
      expect(service.calculateScore('Wd')).toBe(1);
    });

    it('should return 1 for no ball', () => {
      expect(service.calculateScore('Nb')).toBe(1);
    });

    it('should return 0 for wicket', () => {
      expect(service.calculateScore('W')).toBe(0);
    });
  });

  describe('addBall', () => {
    it('should add ball to first innings', () => {
      service.innings.set(1);

      service.addBall('4');

      expect(service.firstInningsBalls()).toEqual(['4']);
    });

    it('should add ball to second innings', () => {
      service.innings.set(2);

      service.addBall('6');

      expect(service.secondInningsBalls()).toEqual(['6']);
    });
  });

  it('should fetch live matches', () => {
    const mockData = [{ id: 1 }];

    service.GetLiveMatches().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/matches'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockData);
  });

  it('should update match', () => {
    const mockResponse = {
      id: 1,
      status: 'Live',
    };

    service.UpdateMatch(1, {
      status: 'Live',
    }).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/matches/1'
    );

    expect(req.request.method).toBe('PUT');

    req.flush(mockResponse);
  });
});