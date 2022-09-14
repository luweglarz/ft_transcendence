import { TestBed } from '@angular/core/testing';

import { IsInGameGuard } from './is-in-game.guard';

describe('IsInGameGuard', () => {
  let guard: IsInGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsInGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
