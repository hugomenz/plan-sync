import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef;

  drawing = false;

  @Input()
  set drawingColor(color: string) {
    this._drawingColor = color;
  }
  get drawingColor() {
    return this._drawingColor;
  }
  private _drawingColor!: string;

  @Input()
  set drawingThickness(thickness: number) {
    this._drawingThickness = thickness;
  }
  get drawingThickness() {
    return this._drawingThickness;
  }
  private _drawingThickness!: number;

  @Input() drawingEnabled!: boolean;

  ngAfterViewInit() {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument('/assets/test.pdf');

    loadingTask.promise.then(
      (pdf) => {
        console.log('PDF loaded');

        const pageNumber = 1;
        pdf.getPage(pageNumber).then((page) => {
          console.log('Page loaded');

          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });

          const context = this.canvas.nativeElement.getContext('2d');
          this.canvas.nativeElement.height = viewport.height;
          this.canvas.nativeElement.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          const renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            console.log('Page rendered');
          });
        });
      },
      (reason) => {
        console.error(reason);
      }
    );
  }

  handleCanvasMouseDown(event: MouseEvent) {
    // TODO: Investigate paperjs para simplificar los dibujos y asi suavizar lineas

    if (!this.drawingEnabled) {
      return;
    }

    this.drawing = true;

    const context = this.canvas.nativeElement.getContext('2d');
    context.strokeStyle = this.drawingColor;
    context.fillStyle = this.drawingColor;
    context.lineWidth = this.drawingThickness;
    context.beginPath();

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.moveTo(x, y);
  }

  handleCanvasMouseMove(event: MouseEvent) {
    if (!this.drawingEnabled || !this.drawing) {
      return;
    }

    const context = this.canvas.nativeElement.getContext('2d');

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
  }

  handleCanvasMouseUp(event: MouseEvent) {
    if (!this.drawingEnabled) {
      return;
    }

    this.drawing = false;
  }
}
