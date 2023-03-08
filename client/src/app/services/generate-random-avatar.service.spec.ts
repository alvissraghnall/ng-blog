import { TestBed } from '@angular/core/testing';

import { GenerateRandomAvatarService } from './generate-random-avatar.service';

describe('GenerateRandomAvatarService', () => {
  let service: GenerateRandomAvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateRandomAvatarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
