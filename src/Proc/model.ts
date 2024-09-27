import { F2, F3, F4, ROT } from "./types";

export interface BuildStep {
  type: 'e' | 'b';
  offset: F3,
  rotate?: ROT,
  color?: string
}
export interface LineExtrudeStep extends BuildStep {
  type: 'e';
  points: (F2 | F3 | F4)[],
  min: number;
  max: number;
}
export interface BoxStep extends BuildStep {
  type: 'b';
  width: number;
  depth: number;
  height: number;
}

export interface ProcItem<T extends BuildStep> {
  id: string;
  offset: F3;
  color: string;
  name: string;
  steps: T[]
}
