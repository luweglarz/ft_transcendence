import { TestBed } from '@angular/core/testing';

import { LadderService } from './ladder.service';

describe('LadderService', () => {
  let service: LadderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LadderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
