import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DrawingService } from '../drawing-service.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  @Output() sidebarVisibilityChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  isDrawing = false;
  drawingName = '';
  selectedColor = 'blue';
  selectedThickness = 3;
  isVisible = true;

  constructor(public drawingService: DrawingService) {}

  ngOnInit(): void {}

  onNewDrawing(): void {
    this.isDrawing = true;
    this.drawingName = '';
    this.drawingService.startDrawing();
  }

  onColorChange(): void {
    this.drawingService.changeColor(this.selectedColor);
  }

  onThicknessChange(): void {
    this.drawingService.changeThickness(this.selectedThickness);
  }

  onFinishDrawing(): void {
    this.isDrawing = false;
    this.drawingService.saveAnnotation(this.drawingName);
    this.drawingService.stopDrawing();
  }

  toggleSidebar(): void {
    this.isVisible = !this.isVisible;
    this.sidebarVisibilityChanged.emit(this.isVisible);
  }
}
