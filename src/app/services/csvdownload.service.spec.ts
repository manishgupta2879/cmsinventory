import { TestBed } from '@angular/core/testing';

import { CsvdownloadService } from './csvdownload.service';

describe('CsvdownloadService', () => {
  let service: CsvdownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvdownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
