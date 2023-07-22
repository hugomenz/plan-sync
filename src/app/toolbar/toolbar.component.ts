import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Output() colorSelected = new EventEmitter<string>();
  @Output() thicknessSelected = new EventEmitter<number>();
  @Output() drawingEnabled = new EventEmitter<boolean>();

  selectColor(color: string) {
    this.colorSelected.emit(color);
  }

  selectThickness(thickness: number) {
    this.thicknessSelected.emit(thickness);
  }

  toggleDrawing(event: Event) {
    const checkboxElement = event.target as HTMLInputElement;
    this.drawingEnabled.emit(checkboxElement.checked);
  }
}
