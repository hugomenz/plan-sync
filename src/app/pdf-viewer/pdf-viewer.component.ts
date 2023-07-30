import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { Subject, takeUntil } from 'rxjs';
import { DrawingService } from '../drawing-service.service';
import { DrawingAnnotationService } from '../drawing-annotation.service';
import { Annotation } from '../models';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: false }) canvasElement!: ElementRef;

  private fabricCanvas!: fabric.Canvas;
  private brush!: fabric.PencilBrush;

  private currentColor = 'black';
  private currentThickness = 1;

  private newObjects: fabric.Object[] = [];
  private previousAnnotation!: Annotation;

  private destroy$ = new Subject<void>();

  constructor(
    private drawingService: DrawingService,
    public drawingAnnotationService: DrawingAnnotationService
  ) {}

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
        this.currentColor = color;
        if (this.brush) {
          this.brush.color = color;
        }
      });

    this.drawingService.thicknessChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((thickness) => {
        this.currentThickness = thickness;
        if (this.brush) {
          this.brush.width = thickness;
        }
      });

    this.fabricCanvas.on('object:added', (options) => {
      this.newObjects.push(options.target as fabric.Object);
    });

    this.drawingService.saveAnnotation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        if (this.newObjects.length > 0) {
          this.drawingAnnotationService.addAnnotation(
            name,
            this.currentColor,
            this.currentThickness,
            JSON.stringify(this.newObjects.map((obj) => obj.toJSON())),
            [...this.newObjects]
          );

          this.newObjects = [];
        }
      });

    this.drawingAnnotationService.highlightAnnotation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((annotation) => {
        if (this.previousAnnotation) {
          this.updateObjects(
            this.previousAnnotation,
            this.previousAnnotation.color,
            this.previousAnnotation.thickness
          );
        }

        this.updateObjects(annotation, 'yellow', 5);

        this.previousAnnotation = annotation;
      });

    this.loadPDF();
  }

  private loadPDF(): void {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument('/assets/test.pdf');

    loadingTask.promise.then(
      (pdf) => {
        const pageNumber = 1;
        pdf.getPage(pageNumber).then((page) => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });

          this.fabricCanvas.setHeight(viewport.height);
          this.fabricCanvas.setWidth(viewport.width);

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
            this.brush = new fabric.PencilBrush(this.fabricCanvas);
            this.fabricCanvas.freeDrawingBrush = this.brush;

            fabric.Image.fromURL(pdfCanvas.toDataURL(), (img) => {
              img.set({
                left: 0,
                top: 0,
                angle: 0,
                opacity: 1.0,
                selectable: false,
              });

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

  private updateObjects(
    annotation: Annotation,
    stroke: string,
    strokeWidth: number
  ): void {
    const objects =
      this.drawingAnnotationService.getObjectsForAnnotation(annotation);
    if (objects) {
      objects.forEach((obj) => {
        if (obj.type === 'path') {
          obj.set({ stroke, strokeWidth });
        }
      });
      this.fabricCanvas.renderAll();
    } else {
      console.error(`Annotation not found with the name:  ${annotation.name}`);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
