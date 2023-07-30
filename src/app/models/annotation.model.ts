export interface Annotation {
  id: number;
  name: string;
  color: string;
  thickness: number;
  json: string;
  objects: fabric.Object[];
}
