import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialnameComponent } from './materialname.component';

describe('MaterialnameComponent', () => {
  let component: MaterialnameComponent;
  let fixture: ComponentFixture<MaterialnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialnameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
