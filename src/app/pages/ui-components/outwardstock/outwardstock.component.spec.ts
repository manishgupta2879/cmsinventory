import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardstockComponent } from './outwardstock.component';

describe('OutwardstockComponent', () => {
  let component: OutwardstockComponent;
  let fixture: ComponentFixture<OutwardstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutwardstockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutwardstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
