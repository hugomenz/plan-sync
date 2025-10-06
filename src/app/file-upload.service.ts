import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DocumentInfo {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
  size: number;
  pageCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private _currentDocument = new BehaviorSubject<DocumentInfo | null>(null);
  private _isUploading = new BehaviorSubject<boolean>(false);
  private _uploadProgress = new BehaviorSubject<number>(0);
  private _documents: DocumentInfo[] = [];

  currentDocument$ = this._currentDocument.asObservable();
  isUploading$ = this._isUploading.asObservable();
  uploadProgress$ = this._uploadProgress.asObservable();

  get documents(): DocumentInfo[] {
    return [...this._documents];
  }

  get currentDocument(): DocumentInfo | null {
    return this._currentDocument.value;
  }

  uploadFile(file: File): Observable<DocumentInfo> {
    return new Observable(observer => {
      if (!file || file.type !== 'application/pdf') {
        observer.error(new Error('Solo se permiten archivos PDF'));
        return;
      }

      this._isUploading.next(true);
      this._uploadProgress.next(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        const currentProgress = this._uploadProgress.value;
        if (currentProgress < 90) {
          this._uploadProgress.next(currentProgress + Math.random() * 20);
        }
      }, 100);

      // Simulate file processing
      setTimeout(() => {
        clearInterval(interval);
        this._uploadProgress.next(100);

        const documentInfo: DocumentInfo = {
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file),
          uploadDate: new Date(),
          size: file.size,
          pageCount: 1 // This would be determined by PDF parsing
        };

        this._documents.push(documentInfo);
        this._currentDocument.next(documentInfo);
        this._isUploading.next(false);
        this._uploadProgress.next(0);

        observer.next(documentInfo);
        observer.complete();
      }, 2000);
    });
  }

  selectDocument(documentId: string): boolean {
    const document = this._documents.find(d => d.id === documentId);
    if (document) {
      this._currentDocument.next(document);
      return true;
    }
    return false;
  }

  removeDocument(documentId: string): boolean {
    const index = this._documents.findIndex(d => d.id === documentId);
    if (index >= 0) {
      const document = this._documents[index];
      if (document.url.startsWith('blob:')) {
        URL.revokeObjectURL(document.url);
      }
      this._documents.splice(index, 1);
      
      if (this._currentDocument.value?.id === documentId) {
        this._currentDocument.next(this._documents.length > 0 ? this._documents[0] : null);
      }
      return true;
    }
    return false;
  }

  getSupportedFormats(): string[] {
    return ['.pdf'];
  }

  getMaxFileSize(): number {
    return 50 * 1024 * 1024; // 50MB
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No se seleccionó ningún archivo' };
    }

    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Solo se permiten archivos PDF' };
    }

    if (file.size > this.getMaxFileSize()) {
      return { valid: false, error: 'El archivo es demasiado grande (máximo 50MB)' };
    }

    return { valid: true };
  }
}