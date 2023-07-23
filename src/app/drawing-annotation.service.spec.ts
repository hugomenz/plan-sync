import { TestBed } from '@angular/core/testing';

import { DrawingAnnotationService } from './drawing-annotation.service';

describe('DrawingAnnotationService', () => {
  let service: DrawingAnnotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingAnnotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
