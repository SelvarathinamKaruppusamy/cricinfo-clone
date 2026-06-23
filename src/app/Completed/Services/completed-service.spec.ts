import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { CompletedService } from './completed-service';

describe('CompletedService', () => {
  let service: CompletedService;

  const mockHttpClient = {
    get: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompletedService,
        {
          provide: HttpClient,
          useValue: mockHttpClient,
        },
      ],
    });

    service = TestBed.inject(CompletedService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get completed matches', () => {
    const mockData = [{ matchNo: 1 }];

    mockHttpClient.get.mockReturnValue(of(mockData));

    service.getCompletedMatches().subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      'http://localhost:7000/completed'
    );
  });

  it('should get match by matchNo', () => {
    const mockData = [{ matchNo: 1 }];

    mockHttpClient.get.mockReturnValue(of(mockData));

    service.getMatch(1).subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      'http://localhost:7000/completed?matchNo=1'
    );
  });
});