import { TestBed } from '@angular/core/testing';

import { DirectMessagesService } from './direct-messages.service';

describe('DirectMessagesService', () => {
  let service: DirectMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
