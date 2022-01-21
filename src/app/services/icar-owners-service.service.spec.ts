import { TestBed } from '@angular/core/testing';

import { ICarOwnersServiceService } from './icar-owners-service.service';

describe('ICarOwnersServiceService', () => {
  let service: ICarOwnersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ICarOwnersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
