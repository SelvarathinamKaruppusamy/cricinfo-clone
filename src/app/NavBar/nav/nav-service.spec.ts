import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { NavService } from './nav-service';

describe('NavService', () => {
  let service: NavService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(NavService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data', () => {
    const mockData = [
      {
        id: 1,
        matchNo: 1,
      },
    ];

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:5000/matches');

    expect(req.request.method).toBe('GET');

    req.flush(mockData);
  });
});
