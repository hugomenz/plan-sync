import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  isDrawing = false;
  drawingName = '';
  selectedColor!: string;
  selectedThickness!: number;

  @Output() newDrawing = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<string>();
  @Output() thicknessSelected = new EventEmitter<number>();
  @Output() finishDrawing = new EventEmitter<{ name: string; color: string }>();

  constructor() {}

  ngOnInit(): void {}

  onNewDrawing() {
    this.isDrawing = true;
    this.drawingName = '';
    this.newDrawing.emit();
  }

  onFinishDrawing() {
    this.isDrawing = false;
  }
  onColorChange() {
    this.colorSelected.emit(this.selectedColor);
  }

  onThicknessChange() {
    this.thicknessSelected.emit(this.selectedThickness);
  }
}
