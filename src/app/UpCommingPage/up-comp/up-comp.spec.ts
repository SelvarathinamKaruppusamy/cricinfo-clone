import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpComp } from './up-comp';

describe('UpComp', () => {
  let component: UpComp;
  let fixture: ComponentFixture<UpComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
