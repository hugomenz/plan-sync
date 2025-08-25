import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DrawingService } from '../drawing-service.service';

interface ColorOption {
  name: string;
  value: string;
  label: string;
}

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

  availableColors: ColorOption[] = [
    { name: 'red', value: 'red', label: 'Rojo' },
    { name: 'blue', value: 'blue', label: 'Azul' },
    { name: 'green', value: 'green', label: 'Verde' },
    { name: 'yellow', value: 'yellow', label: 'Amarillo' },
    { name: 'purple', value: 'purple', label: 'Púrpura' },
    { name: 'orange', value: 'orange', label: 'Naranja' },
  ];

  availableThickness: number[] = [1, 3, 5];

  constructor(public drawingService: DrawingService) {}

  ngOnInit(): void {
    // Initialize with default values
    this.drawingService.changeColor(this.selectedColor);
    this.drawingService.changeThickness(this.selectedThickness);
  }

  onNewDrawing(): void {
    this.isDrawing = true;
    this.drawingName = '';
    this.drawingService.startDrawing();
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.drawingService.changeColor(color);
  }

  selectThickness(thickness: number): void {
    this.selectedThickness = thickness;
    this.drawingService.changeThickness(thickness);
  }

  onFinishDrawing(): void {
    if (!this.drawingName.trim()) {
      this.drawingName = `Anotación ${new Date().toLocaleTimeString()}`;
    }
    
    this.isDrawing = false;
    this.drawingService.saveAnnotation(this.drawingName);
    this.drawingService.stopDrawing();
  }

  onCancelDrawing(): void {
    this.isDrawing = false;
    this.drawingName = '';
    this.drawingService.stopDrawing();
  }

  toggleSidebar(): void {
    this.isVisible = !this.isVisible;
    this.sidebarVisibilityChanged.emit(this.isVisible);
  }
}
