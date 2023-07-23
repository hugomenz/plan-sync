import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DrawingAnnotationService } from '../drawing-annotation.service';
import { Annotation } from '../models';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent {
  constructor(public drawingAnnotationService: DrawingAnnotationService) {}

  sidebarVisible: boolean = true;

  // Event emitter for when an annotation is selected
  @Output() annotationSelected = new EventEmitter<Annotation>();

  @Output() sidebarVisibilityChanged = new EventEmitter<boolean>();

  selectAnnotation(annotation: Annotation) {
    // Emit the selected annotation
    this.annotationSelected.emit(annotation);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibilityChanged.emit(this.sidebarVisible);
  }
}
