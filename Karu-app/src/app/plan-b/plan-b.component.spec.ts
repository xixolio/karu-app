import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanBComponent } from './plan-b.component';

describe('PlanBComponent', () => {
  let component: PlanBComponent;
  let fixture: ComponentFixture<PlanBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
