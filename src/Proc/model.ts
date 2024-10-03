import { SetStoreFunction } from "solid-js/store";
import { F2, F3, F4, ROT } from "./types";

export type BuildStepType = 'e' | 'b' | 'd' | 't' | 'g';

export interface BuildStep {
  type: BuildStepType;
  offset: F3,
  color?: string;
  rotate?: ROT;
}
export interface LineExtrudeStep extends BuildStep {
  type: 'e';
  points: (F2 | F3 | F4)[],
  min: number;
  max: number;
  rotate?: ROT,
}

export interface BoxStep extends BuildStep {
  type: 'b';
  width: number;
  depth: number;
  height: number;
  sides: [number,number,number,number,number,number]
}

export interface GroupStep extends BuildStep {
  type: 'g';
  children: number[];
}

export interface DuplicateStep extends BuildStep {
  target: number;
}

export interface TileStep extends BuildStep {
  type: 't';
}

export interface ProcItem<T extends BuildStep> {
  id: string;
  offset: F3;
  color: string;
  name: string;
  steps: T[]
}
export type StoreType<T extends BuildStep> = [get: ProcItem<T>[], set: SetStoreFunction<ProcItem<T>[]>]