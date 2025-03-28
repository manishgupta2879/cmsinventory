import { TestBed } from '@angular/core/testing';

import { MaterialnameService } from './materialname.service';

describe('MaterialnameService', () => {
  let service: MaterialnameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialnameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
