import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import { fabric } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { Subject, takeUntil } from 'rxjs';
import { DrawingService } from '../drawing-service.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: false }) canvasElement!: ElementRef;

  private fabricCanvas!: fabric.Canvas;
  private brush!: fabric.PencilBrush;
  private destroy$ = new Subject<void>();

  constructor(private drawingService: DrawingService) {}

  ngAfterViewInit() {
    this.fabricCanvas = new fabric.Canvas(this.canvasElement.nativeElement);

    this.drawingService.startDrawing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fabricCanvas.isDrawingMode = true;
      });

    this.drawingService.stopDrawing$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fabricCanvas.isDrawingMode = false;
      });

    this.drawingService.colorChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((color) => {
        if (this.brush) {
          this.brush.color = color;
        }
        console.log(`from observable pdf-viewer,. color: ${color}`);
      });

    this.drawingService.thicknessChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((thickness) => {
        if (this.brush) {
          this.brush.width = thickness;
        }
        console.log(`from observable pdf-viewer, thickness: ${thickness}`);
      });

    this.loadPDF();
  }

  private loadPDF(): void {
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

          this.fabricCanvas.setHeight(viewport.height);
          this.fabricCanvas.setWidth(viewport.width);

          // Crear un nuevo canvas para renderizar la página PDF
          const pdfCanvas = document.createElement('canvas');
          pdfCanvas.height = viewport.height;
          pdfCanvas.width = viewport.width;
          const context = pdfCanvas.getContext('2d');
          if (!context) {
            console.error('2D context not available');
            return;
          }
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          const renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            console.log('Page rendered');

            this.brush = new fabric.PencilBrush(this.fabricCanvas);
            this.fabricCanvas.freeDrawingBrush = this.brush;

            fabric.Image.fromURL(pdfCanvas.toDataURL(), (img) => {
              img.set({
                left: 0,
                top: 0,
                angle: 0,
                opacity: 1.0,
                selectable: false, // Esto hace que la imagen del PDF no sea seleccionable, es decir, no puedes moverla ni cambiarla de tamaño
              });

              // Añade la imagen del PDF al canvas de Fabric.js
              this.fabricCanvas.add(img);
              this.fabricCanvas.sendToBack(img);
            });
          });
        });
      },
      (reason) => {
        console.error(reason);
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
