import { TestBed } from '@angular/core/testing';

import { MatchHistoryService } from './match-history.service';

describe('MatchHistoryService', () => {
  let service: MatchHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
