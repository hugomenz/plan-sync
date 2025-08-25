import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService, DocumentInfo } from '../file-upload.service';
import { AnnotationToolService } from '../annotation-tool.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  
  @Output() colorSelected = new EventEmitter<string>();
  @Output() thicknessSelected = new EventEmitter<number>();
  @Output() drawingEnabled = new EventEmitter<boolean>();
  @Output() documentSelected = new EventEmitter<DocumentInfo>();
  @Output() exportRequested = new EventEmitter<string>();

  constructor(
    public fileUploadService: FileUploadService,
    public annotationToolService: AnnotationToolService
  ) {}

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

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const validation = this.fileUploadService.validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      this.fileUploadService.uploadFile(file).subscribe({
        next: (document) => {
          this.documentSelected.emit(document);
        },
        error: (error) => {
          alert(`Error al cargar el archivo: ${error.message}`);
        }
      });
    }
    
    // Reset input
    input.value = '';
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onDocumentSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (this.fileUploadService.selectDocument(target.value)) {
      const document = this.fileUploadService.currentDocument;
      if (document) {
        this.documentSelected.emit(document);
      }
    }
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onSearch(target.value);
  }

  onExportPDF(): void {
    this.exportRequested.emit('pdf');
  }

  onExportImage(): void {
    this.exportRequested.emit('image');
  }

  onSearch(query: string): void {
    // TODO: Implement search functionality
    console.log('Search:', query);
  }

  onPrint(): void {
    window.print();
  }

  onFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
