import { TestBed } from '@angular/core/testing';

import { MaterialgroupService } from './materialgroup.service';

describe('MaterialgroupService', () => {
  let service: MaterialgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
