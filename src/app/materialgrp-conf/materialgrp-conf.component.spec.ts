import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialgrpConfComponent } from './materialgrp-conf.component';

describe('MaterialgrpConfComponent', () => {
  let component: MaterialgrpConfComponent;
  let fixture: ComponentFixture<MaterialgrpConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialgrpConfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialgrpConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
