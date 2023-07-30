import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Annotation } from './models';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  private _startDrawing = new Subject<void>();
  private _stopDrawing = new Subject<void>();
  private _colorChange = new BehaviorSubject<string>('blue');
  private _thicknessChange = new BehaviorSubject<number>(3);
  private _saveAnnotation = new Subject<string>();

  startDrawing$ = this._startDrawing.asObservable();
  stopDrawing$ = this._stopDrawing.asObservable();
  colorChange$ = this._colorChange.asObservable();
  thicknessChange$ = this._thicknessChange.asObservable();
  saveAnnotation$ = this._saveAnnotation.asObservable();

  startDrawing() {
    this._startDrawing.next();
  }

  stopDrawing() {
    this._stopDrawing.next();
  }

  changeColor(color: string) {
    console.log(`called changeColor: ${color}`);
    this._colorChange.next(color);
  }

  changeThickness(thickness: number) {
    console.log(`called changeThickness: ${thickness}`);

    this._thicknessChange.next(thickness);
  }

  saveAnnotation(name: string) {
    this._saveAnnotation.next(name);
  }

  // En DrawingService
  private _highlightAnnotation = new Subject<Annotation>();

  highlightAnnotation$ = this._highlightAnnotation.asObservable();

  highlightAnnotation(annotation: Annotation) {
    console.log(
      'highlightAnnotation method called with annotation:',
      annotation
    );

    console.log(`annotation path length : ${annotation}`);

    this._highlightAnnotation.next(annotation);
  }
}
