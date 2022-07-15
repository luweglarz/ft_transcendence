import { TestBed } from '@angular/core/testing';

import { MatchmakingService } from './matchmaking.service';

describe('MatchmakingService', () => {
  let service: MatchmakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchmakingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
