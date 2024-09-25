import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialgroupComponent } from './materialgroup.component';

describe('MaterialgroupComponent', () => {
  let component: MaterialgroupComponent;
  let fixture: ComponentFixture<MaterialgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialgroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
