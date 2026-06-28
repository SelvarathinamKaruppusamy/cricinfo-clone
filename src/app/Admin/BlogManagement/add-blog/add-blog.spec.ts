import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlog } from './add-blog';

describe('AddBlog', () => {
  let component: AddBlog;
  let fixture: ComponentFixture<AddBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
