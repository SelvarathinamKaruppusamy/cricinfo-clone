import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedDetails } from './completed-details';

describe('CompletedDetails', () => {
  let component: CompletedDetails;
  let fixture: ComponentFixture<CompletedDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
