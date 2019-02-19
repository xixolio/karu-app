import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialIngredientsComponent } from './special-ingredients.component';

describe('SpecialIngredientsComponent', () => {
  let component: SpecialIngredientsComponent;
  let fixture: ComponentFixture<SpecialIngredientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialIngredientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
