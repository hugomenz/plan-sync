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

  constructor(
    public drawingService: DrawingService,
    public drawingAnnotationService: DrawingAnnotationService
  ) {}

  selectAnnotation(annotation: Annotation) {
    this.annotationSelected.emit(annotation);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibilityChanged.emit(this.sidebarVisible);
  }
}
