import { TestBed } from '@angular/core/testing';

import { SignoutService } from './signout.service';

describe('SignoutService', () => {
  let service: SignoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
