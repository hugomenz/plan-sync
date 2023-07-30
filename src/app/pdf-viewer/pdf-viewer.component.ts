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
import { DrawingAnnotationService } from '../drawing-annotation.service';

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

  private currentColor: string = 'black'; // valor por defecto
  private currentThickness: number = 1; // valor por defecto

  private newObjects: fabric.Object[] = [];

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
        this.currentColor = color; // actualiza el color actual
        if (this.brush) {
          this.brush.color = color;
        }
      });

    this.drawingService.thicknessChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((thickness) => {
        this.currentThickness = thickness; // actualiza el grosor actual
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

          // Limpia la lista de nuevos objetos
          this.newObjects = [];
        }
      });

    this.drawingAnnotationService.highlightAnnotation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((annotation) => {
        // Obtén los objetos para la anotación
        const objects =
          this.drawingAnnotationService.getObjectsForAnnotation(annotation);
        if (objects) {
          console.log('Objects to highlight:', objects);
          // Resalta cada objeto
          objects.forEach((obj) => {
            if (obj.type === 'path') {
              // Si el objeto ya está resaltado, restablece sus propiedades originales
              if (obj.stroke === 'yellow' && obj.strokeWidth === 5) {
                obj.set({
                  stroke: annotation.color,
                  strokeWidth: annotation.thickness,
                });
              }
              // Si el objeto no está resaltado, aplícale el resaltado
              else {
                obj.set({ stroke: 'yellow', strokeWidth: 5 });
              }
            }
          });
          this.fabricCanvas.renderAll();
        } else {
          console.log(
            `No se encontró ninguna anotación con el nombre ${annotation.name}`
          );
        }
      });

    /*  this.drawingService.highlightAnnotation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((annotation) => {
        // Crear un lienzo estático para cargar el JSON
        let tempCanvas = new fabric.StaticCanvas(null);

        tempCanvas.loadFromJSON(annotation.json, () => {
          tempCanvas.forEachObject((object) => {
            if (object.type === 'path') {
              object.set({ stroke: 'yellow', strokeWidth: 5 });
            }
            // Verificar si el objeto ya existe en el lienzo
            let objectExists = this.fabricCanvas
              .getObjects()
              .some((existingObject) => {
                let existingTop = this.roundToTwoDecimals(existingObject.top);
                let newTop = object.top;
                let existingLeft = this.roundToTwoDecimals(existingObject.left);
                let newLeft = object.left;

                return (
                  existingTop === newTop &&
                  existingTop === 0 &&
                  existingLeft === newLeft &&
                  existingLeft === 0
                );
              });

            if (!objectExists) {
              this.fabricCanvas.add(object);
            }
          });

          this.fabricCanvas.renderAll();
        });
      }); */

    this.loadPDF();
  }

  private roundToTwoDecimals(num: number | undefined): number {
    return Number(num?.toFixed(2));
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
