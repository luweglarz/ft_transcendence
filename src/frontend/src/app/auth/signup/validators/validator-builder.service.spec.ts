import { TestBed } from '@angular/core/testing';

import { ValidatorBuilderService } from './validator-builder.service';

describe('ValidatorBuilderService', () => {
  let service: ValidatorBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
