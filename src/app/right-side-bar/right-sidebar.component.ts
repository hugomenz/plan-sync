import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawingService } from '../drawing-service.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  isDrawing = false;
  drawingName = '';
  selectedColor = 'blue';
  selectedThickness = 3;

  @Output() sidebarVisibilityChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(public drawingService: DrawingService) {}

  ngOnInit(): void {}

  onNewDrawing() {
    this.isDrawing = true;
    this.drawingName = '';
    this.drawingService.startDrawing();
  }

  onColorChange() {
    this.drawingService.changeColor(this.selectedColor);
  }

  onThicknessChange() {
    this.drawingService.changeThickness(this.selectedThickness);
  }

  onFinishDrawing() {
    this.isDrawing = false;
    this.drawingService.saveAnnotation(this.drawingName);
    this.drawingService.stopDrawing();
  }

  isVisible: boolean = true; // Asume que la barra lateral es visible inicialmente

  toggleSidebar() {
    this.isVisible = !this.isVisible; // Cambia el estado
    this.sidebarVisibilityChanged.emit(this.isVisible); // Emite el nuevo estado
  }
}
