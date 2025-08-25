import { Component, Output, EventEmitter } from '@angular/core';
import { DrawingAnnotationService } from '../drawing-annotation.service';
import { Annotation } from '../models';
import { DrawingService } from '../drawing-service.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent {
  @Output() annotationSelected = new EventEmitter<Annotation>();
  @Output() sidebarVisibilityChanged = new EventEmitter<boolean>();

  sidebarVisible: boolean = true;
  selectedAnnotation: Annotation | null = null;

  constructor(
    public drawingService: DrawingService,
    public drawingAnnotationService: DrawingAnnotationService
  ) {
    // Subscribe to annotation highlights to track selection
    this.drawingAnnotationService.highlightAnnotation$.subscribe(annotation => {
      this.selectedAnnotation = annotation;
    });
  }

  selectAnnotation(annotation: Annotation) {
    this.selectedAnnotation = annotation;
    this.annotationSelected.emit(annotation);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibilityChanged.emit(this.sidebarVisible);
  }

  trackByAnnotation(index: number, annotation: Annotation): number {
    return annotation.id;
  }
}
