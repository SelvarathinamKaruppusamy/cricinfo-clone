import { TestBed } from '@angular/core/testing';

import { Pointstable } from './pointstable';

describe('Pointstable', () => {
  let service: Pointstable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pointstable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
