import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  private _startDrawing = new Subject<void>();
  private _stopDrawing = new Subject<void>();
  private _colorChange = new BehaviorSubject<string>('blue');
  private _thicknessChange = new BehaviorSubject<number>(3);

  startDrawing$ = this._startDrawing.asObservable();
  stopDrawing$ = this._stopDrawing.asObservable();
  colorChange$ = this._colorChange.asObservable();
  thicknessChange$ = this._thicknessChange.asObservable();

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
}
