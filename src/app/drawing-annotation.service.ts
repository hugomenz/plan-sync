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

  addAnnotation(
    name: string,
    color: string,
    thickness: number,
    json: string,
    objects: fabric.Object[]
  ) {
    const id =
      this._annotations.length > 0
        ? Math.max(...this._annotations.map((a) => a.id)) + 1
        : 0;

    const newAnnotation = { id, name, color, thickness, json, objects };
    this.annotations.push(newAnnotation);

    return newAnnotation;
  }
}
