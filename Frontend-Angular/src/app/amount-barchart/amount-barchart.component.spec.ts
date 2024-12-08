import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountBarchartComponent } from './amount-barchart.component';

describe('AmountBarchartComponent', () => {
  let component: AmountBarchartComponent;
  let fixture: ComponentFixture<AmountBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountBarchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
