import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DrawingService } from '../drawing-service.service';
import { AnnotationToolService, ToolType } from '../annotation-tool.service';

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
  selectedTool = 'pen';
  isVisible = true;

  availableColors: ColorOption[] = [
    { name: 'red', value: '#ef4444', label: 'Rojo' },
    { name: 'blue', value: '#3b82f6', label: 'Azul' },
    { name: 'green', value: '#10b981', label: 'Verde' },
    { name: 'yellow', value: '#f59e0b', label: 'Amarillo' },
    { name: 'purple', value: '#8b5cf6', label: 'Púrpura' },
    { name: 'orange', value: '#f97316', label: 'Naranja' },
  ];

  availableThickness: number[] = [1, 3, 5, 8, 12];

  constructor(
    public drawingService: DrawingService,
    public annotationToolService: AnnotationToolService
  ) {}

  ngOnInit(): void {
    // Initialize with default values
    this.drawingService.changeColor(this.selectedColor);
    this.drawingService.changeThickness(this.selectedThickness);
    
    // Subscribe to tool changes
    this.annotationToolService.selectedTool$.subscribe(tool => {
      this.selectedTool = tool;
    });
    
    this.annotationToolService.isDrawing$.subscribe(drawing => {
      this.isDrawing = drawing;
    });
  }

  get availableTools(): ToolType[] {
    return this.annotationToolService.availableTools;
  }

  onNewDrawing(): void {
    this.isDrawing = true;
    this.drawingName = '';
    this.annotationToolService.startDrawing();
    this.drawingService.startDrawing();
  }

  selectTool(toolId: string): void {
    this.selectedTool = toolId;
    this.annotationToolService.selectTool(toolId);
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
    this.annotationToolService.stopDrawing();
  }

  onCancelDrawing(): void {
    this.isDrawing = false;
    this.drawingName = '';
    this.drawingService.stopDrawing();
    this.annotationToolService.stopDrawing();
  }

  onUndo(): void {
    // TODO: Implement undo functionality
    console.log('Undo requested');
  }

  onRedo(): void {
    // TODO: Implement redo functionality
    console.log('Redo requested');
  }

  onClearAll(): void {
    if (confirm('¿Estás seguro de que quieres eliminar todas las anotaciones?')) {
      // TODO: Implement clear all functionality
      console.log('Clear all requested');
    }
  }

  get selectedToolIcon(): string {
    const tool = this.availableTools.find(t => t.id === this.selectedTool);
    return tool?.icon || '✏️';
  }

  get selectedToolName(): string {
    const tool = this.availableTools.find(t => t.id === this.selectedTool);
    return tool?.name || 'Dibujo';
  }

  toggleSidebar(): void {
    this.isVisible = !this.isVisible;
    this.sidebarVisibilityChanged.emit(this.isVisible);
  }
}
