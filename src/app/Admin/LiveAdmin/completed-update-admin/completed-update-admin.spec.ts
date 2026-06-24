import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedUpdateAdmin } from './completed-update-admin';

describe('CompletedUpdateAdmin', () => {
  let component: CompletedUpdateAdmin;
  let fixture: ComponentFixture<CompletedUpdateAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedUpdateAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedUpdateAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
