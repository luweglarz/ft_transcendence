import { TestBed } from '@angular/core/testing';

import { WaitService } from './wait.service';

describe('WaitService', () => {
  let service: WaitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
