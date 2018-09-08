import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingOrderComponent } from './ongoing-order.component';

describe('OngoingOrderComponent', () => {
  let component: OngoingOrderComponent;
  let fixture: ComponentFixture<OngoingOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
