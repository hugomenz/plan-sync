import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent {
  sidebarVisible: boolean = true;

  // Array of annotations
  @Input() annotations: { name: string; color: string }[] = [
    { name: 'Anotación 1', color: 'red' },
    { name: 'Anotación 2', color: 'blue' },
    { name: 'Anotación 3', color: 'green' },
  ];

  // Event emitter for when an annotation is selected
  @Output() annotationSelected = new EventEmitter<{
    name: string;
    color: string;
  }>();

  @Output() sidebarVisibilityChanged = new EventEmitter<boolean>();

  selectAnnotation(annotation: { name: string; color: string }) {
    // Emit the selected annotation
    this.annotationSelected.emit(annotation);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibilityChanged.emit(this.sidebarVisible);
  }
}
