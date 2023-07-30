import { Injectable } from '@angular/core';
import { Annotation } from './models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawingAnnotationService {
  private _annotations: Annotation[] = [];
  private _annotationObjects = new Map<Annotation, fabric.Object[]>();

  private _highlightAnnotation = new Subject<Annotation>();
  highlightAnnotation$ = this._highlightAnnotation.asObservable();

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
    this._annotationObjects.set(newAnnotation, objects);

    return newAnnotation;
  }

  highlightAnnotation(annotation: Annotation) {
    this._highlightAnnotation.next(annotation);
    console.log('Annotation to highlight:', annotation);
  }

  getObjectsForAnnotation(annotation: Annotation): fabric.Object[] | undefined {
    return this._annotationObjects.get(annotation);
  }
}
