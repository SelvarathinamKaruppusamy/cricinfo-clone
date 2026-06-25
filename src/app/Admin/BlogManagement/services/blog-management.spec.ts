import { TestBed } from '@angular/core/testing';

import { BlogManagementService } from './blog-management';

describe('BlogManagement', () => {
  let service: BlogManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
