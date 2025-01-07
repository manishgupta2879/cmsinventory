import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardconfComponent } from './inwardconf.component';

describe('InwardconfComponent', () => {
  let component: InwardconfComponent;
  let fixture: ComponentFixture<InwardconfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InwardconfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InwardconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
