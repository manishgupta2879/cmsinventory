import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialStockComponent } from './initial-stock.component';

describe('InitialStockComponent', () => {
  let component: InitialStockComponent;
  let fixture: ComponentFixture<InitialStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
