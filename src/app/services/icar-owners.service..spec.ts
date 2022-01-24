import { TestBed } from '@angular/core/testing';

import { IcarOwnersService } from './icar-owners.service';

describe('ICarOwnersService', () => {
  let service: IcarOwnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcarOwnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
