import { TestBed } from '@angular/core/testing';

import { ProfilInfoService } from '../profil-info.service';

describe('ProfilInfoService', () => {
  let service: ProfilInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
