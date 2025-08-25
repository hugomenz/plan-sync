import { Component } from '@angular/core';
import { DocumentInfo } from './file-upload.service';

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

  onDocumentSelected(document: DocumentInfo) {
    console.log('Document selected:', document);
    // TODO: Load the selected document in the PDF viewer
  }

  onExportRequested(format: string) {
    console.log('Export requested:', format);
    // TODO: Implement export functionality
    if (format === 'pdf') {
      this.exportAsPDF();
    } else if (format === 'image') {
      this.exportAsImage();
    }
  }

  private exportAsPDF() {
    // TODO: Implement PDF export with annotations
    alert('Funcionalidad de exportar PDF estará disponible próximamente');
  }

  private exportAsImage() {
    // TODO: Implement image export
    alert('Funcionalidad de exportar imagen estará disponible próximamente');
  }
}
