import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardconfComponent } from './outwardconf.component';

describe('OutwardconfComponent', () => {
  let component: OutwardconfComponent;
  let fixture: ComponentFixture<OutwardconfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutwardconfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutwardconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
