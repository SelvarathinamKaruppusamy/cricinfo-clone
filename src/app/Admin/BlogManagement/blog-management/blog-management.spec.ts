import { ComponentFixture, TestBed } from '@angular/core/testing';

import {BlogManagementComponent} from './blog-management';

describe('BlogManagement', () => {
  let component: BlogManagementComponent;
  let fixture: ComponentFixture<BlogManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
