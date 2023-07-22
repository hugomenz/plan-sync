import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'spike_pdf-viewer_pdf-js';

  drawingColor: string = 'red';
  drawingThickness: number = 1;
  drawingEnabled: boolean = false;

  onNewDrawing() {
    console.log(`onNewDrawing called!`);

    this.drawingEnabled = true;
    console.log(`drawingEnabled: ${this.drawingEnabled}`);
  }

  onFinishDrawing(event: { name: string; color: string }) {
    this.drawingEnabled = false;
  }

  handleColorSelected(color: string) {
    console.log(`app.component - handleColorSelected - color: ${color}`);
    this.drawingColor = color;
  }

  handleThinknessSelected(thickness: number) {
    console.log(
      `app.component - handleThinknessSelected - thickness: ${thickness}`
    );
    this.drawingThickness = thickness;
  }
}
