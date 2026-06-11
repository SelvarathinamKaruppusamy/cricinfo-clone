import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livepage } from './livepage';

describe('Livepage', () => {
  let component: Livepage;
  let fixture: ComponentFixture<Livepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livepage],
    }).compileComponents();

    fixture = TestBed.createComponent(Livepage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
