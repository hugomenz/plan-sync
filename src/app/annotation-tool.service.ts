import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToolType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const ANNOTATION_TOOLS: ToolType[] = [
  { id: 'pen', name: 'Dibujo Libre', icon: '✏️', description: 'Dibujar a mano alzada' },
  { id: 'text', name: 'Texto', icon: '📝', description: 'Agregar texto' },
  { id: 'rectangle', name: 'Rectángulo', icon: '⬜', description: 'Dibujar rectángulo' },
  { id: 'circle', name: 'Círculo', icon: '⭕', description: 'Dibujar círculo' },
  { id: 'arrow', name: 'Flecha', icon: '➡️', description: 'Dibujar flecha' },
  { id: 'highlighter', name: 'Resaltador', icon: '🖍️', description: 'Resaltar texto' },
];

@Injectable({
  providedIn: 'root'
})
export class AnnotationToolService {
  private _selectedTool = new BehaviorSubject<string>('pen');
  private _isDrawing = new BehaviorSubject<boolean>(false);
  private _annotationHistory: any[] = [];
  private _historyIndex = -1;

  selectedTool$ = this._selectedTool.asObservable();
  isDrawing$ = this._isDrawing.asObservable();

  get availableTools(): ToolType[] {
    return ANNOTATION_TOOLS;
  }

  get selectedTool(): string {
    return this._selectedTool.value;
  }

  get canUndo(): boolean {
    return this._historyIndex > 0;
  }

  get canRedo(): boolean {
    return this._historyIndex < this._annotationHistory.length - 1;
  }

  selectTool(toolId: string): void {
    this._selectedTool.next(toolId);
  }

  startDrawing(): void {
    this._isDrawing.next(true);
  }

  stopDrawing(): void {
    this._isDrawing.next(false);
  }

  saveToHistory(state: any): void {
    // Remove any redo history if we're adding a new state
    this._annotationHistory = this._annotationHistory.slice(0, this._historyIndex + 1);
    this._annotationHistory.push(state);
    this._historyIndex = this._annotationHistory.length - 1;
    
    // Keep only last 50 states to prevent memory issues
    if (this._annotationHistory.length > 50) {
      this._annotationHistory.shift();
      this._historyIndex--;
    }
  }

  undo(): any | null {
    if (this.canUndo) {
      this._historyIndex--;
      return this._annotationHistory[this._historyIndex];
    }
    return null;
  }

  redo(): any | null {
    if (this.canRedo) {
      this._historyIndex++;
      return this._annotationHistory[this._historyIndex];
    }
    return null;
  }

  clearHistory(): void {
    this._annotationHistory = [];
    this._historyIndex = -1;
  }
}