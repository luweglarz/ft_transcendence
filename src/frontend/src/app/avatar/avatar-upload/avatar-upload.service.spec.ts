import { TestBed } from '@angular/core/testing';

import { AvatarUploadService } from './avatar-upload.service';

describe('AvatarUploadService', () => {
  let service: AvatarUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
