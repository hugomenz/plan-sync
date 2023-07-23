import { Injectable } from '@angular/core';
import { Annotation } from './models';

@Injectable({
  providedIn: 'root',
})
export class DrawingAnnotationService {
  private _annotations: Annotation[] = [];

  get annotations(): Annotation[] {
    return this._annotations;
  }

  addAnnotation(name: string, color: string, thickness: number, json: string) {
    this.annotations.push({ name, color, thickness, json });
  }
}
