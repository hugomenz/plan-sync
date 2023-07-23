import { TestBed } from '@angular/core/testing';

import { DrawingServiceService } from './drawing-service.service';

describe('DrawingServiceService', () => {
  let service: DrawingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
