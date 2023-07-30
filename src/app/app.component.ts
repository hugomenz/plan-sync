import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'spike_pdf-viewer_pdf-js';

  drawingColor = 'blue';
  drawingThickness = 3;
  drawingEnabled = false;

  leftSidebarVisible = true;
  rightSidebarVisible = true;

  onNewDrawing() {
    this.drawingEnabled = true;
  }

  onFinishDrawing(event: { name: string; color: string }) {
    this.drawingEnabled = false;
  }

  handleColorSelected(color: string) {
    this.drawingColor = color;
  }

  handleThinknessSelected(thickness: number) {
    this.drawingThickness = thickness;
  }

  handleSidebarVisibilityChange(sidebar: 'left' | 'right', isVisible: boolean) {
    if (sidebar === 'left') {
      this.leftSidebarVisible = isVisible;
    } else {
      this.rightSidebarVisible = isVisible;
    }
  }
}
