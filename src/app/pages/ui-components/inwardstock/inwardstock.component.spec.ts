import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardstockComponent } from './inwardstock.component';

describe('InwardstockComponent', () => {
  let component: InwardstockComponent;
  let fixture: ComponentFixture<InwardstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InwardstockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InwardstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
