import { Material, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";
import { BoxStep, BuildStep, BuildStepType, DuplicateStep, GroupStep, LineExtrudeStep, ProcItem, TileStep } from "./model";
import { BufferGeometry } from "three";
import { LoopBuilder } from "./loop-builder";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"


enum BoxFace {
  FRONT = 0,
  BACK = 1,
  LEFT = 2,
  RIGHT = 3,
  TOP = 4,
  BOTTOM = 5
}

const _materialMap: Record<string, Material> = {};
const getMaterial = (hexCode: string): Material => {
  if (_materialMap[hexCode]) {
    return _materialMap[hexCode];
  }
  const mat = new MeshStandardMaterial({ color: hexCode });
  return _materialMap[hexCode] = mat;
}

function buildGeo(step: BuildStep, geometry: (BufferGeometry|undefined)[]): BufferGeometry|undefined {
  let geo: BufferGeometry | undefined;
  if (step.type == 'e') {
    const extrude = step as LineExtrudeStep;
    geo = LoopBuilder.buildLoop(extrude.points, extrude.min, extrude.max)
  }
  if (step.type == 't') {
    geo = new PlaneGeometry(1,1,1,1);
  }
  if(step.type == 'b') {
    const box = step as BoxStep;
    const {width, height, depth} = box;
    const w = width/2;
    const h = height/2;
    const d = depth/2;
    const sides: BufferGeometry[] = [];
    box.sides.forEach((v,i) => {
      if(v > 0)
      switch(i) {
        case BoxFace.RIGHT:
          sides.push(LoopBuilder.buildLoop([[-w,d],[-w,-d]],-h,h));break;
        case BoxFace.FRONT:
          sides.push(LoopBuilder.buildLoop([[w,d],[-w,d]],-h,h));break;
        case BoxFace.LEFT:
          sides.push(LoopBuilder.buildLoop([[w,-d],[w,d]],-h,h));break;
        case BoxFace.BACK:
          sides.push(LoopBuilder.buildLoop([[-w,-d],[w,-d]],-h,h));break;
        case BoxFace.TOP:
          sides.push(LoopBuilder.buildLoop([[w,h],[-w,h]],-d,d).rotateX(Math.PI / 2));break;
        case BoxFace.BOTTOM:
          sides.push(LoopBuilder.buildLoop([[w,-h],[-w,-h]],d,-d).rotateX(Math.PI / 2));break;
      }
    });
    if(sides.length > 0) {
      geo = BufferGeometryUtils.mergeGeometries(sides);
    }
  }
  if(step.type == 'd') {
    const dup = step as DuplicateStep;
    if(geometry[dup.target]) {
      geo = geometry[dup.target]?.clone();
    }
  }
  if(step.type == 'g') {
    const group = step as GroupStep;
    const parts: (BufferGeometry|undefined)[] = [];
    group.children.forEach(idx => {
      parts.push(geometry[idx])
      geometry[idx] = undefined;
    })
    geo = BufferGeometryUtils.mergeGeometries(parts.filter(x => x !== undefined));
  }
  if (geo != undefined) {
    if (step.rotate) {
      switch (step.rotate) {
        case 'xy':
          break;
        case 'xz':
          geo.rotateX(Math.PI / 2)
          geo.rotateZ(Math.PI)
          break;
        case 'yz':
          geo.rotateY(Math.PI / 2)
          break;
      }
    }
    if (step.offset) {
      geo.translate(...step.offset)
    }
  }
  return geo;
}

export function buildProcItem(item: ProcItem<BuildStep>, obj: Mesh): void {
  obj.name = item.name;
  obj.material = getMaterial(item.color);
  obj.position.set(...item.offset);

  const geometry: (BufferGeometry|undefined)[] = [];
  item.steps.forEach(step => {
    const geo = buildGeo(step, geometry);
    geometry.push(geo);
  })
  if(geometry.length > 0) {
    const comboGeo = BufferGeometryUtils.mergeGeometries(geometry.filter(x => x !== undefined));
    obj.geometry = comboGeo;
  }
}

export function updateProcItem(item: ProcItem<BuildStep>, property: keyof ProcItem<BuildStep>, obj: Mesh): void {
  if (property == 'name') {
    obj.name = item.name;
  }
  if (property == 'color') {
    obj.material = getMaterial(item.color);
  }
  if (property == 'offset') {
    obj.position.set(...item.offset);
  }
  if (property == 'steps') {
    const geometry: (BufferGeometry|undefined)[] = [];
    item.steps.forEach(step => {
      const geo = buildGeo(step, geometry);
      geometry.push(geo);
    })
    const comboGeo = BufferGeometryUtils.mergeGeometries(geometry.filter(x => x !== undefined));
    obj.geometry = comboGeo;
  }
}

const createEdgeExtrudeStep = () => {
  const item: LineExtrudeStep = {
    type: 'e',
    offset:[0,0,0],
    min: 0,
    max: 1,
    rotate: 'xz',
    points: []
  }
  return item;
}
const createBoxStep = () => {
  const item: BoxStep = {
    type: 'b',
    offset: [0,0,0],
    width: 1,
    height: 1,
    depth: 1,
    sides: [1,1,1,1,1,1]
  }
  return item;
}

const createGroupStep = () => {
  const item: GroupStep = {
    type: 'g',
    offset: [0,0,0],
    children: []
  }
  return item;
}

const createTileStep = () => {
  const item: TileStep = {
    type: 't',
    offset: [0,0,0]
  }
  return item;
}

const createDuplicateStep = () => {
  const item: DuplicateStep = {
    type: 'd',
    offset: [0,0,0],
    target: -1
  }
  return item;
}

export const createBuildStepOfType = (type: BuildStepType): BuildStep => {
  switch(type) {
    case 'e':
      return createEdgeExtrudeStep();
    case 'b':
      return createBoxStep();
    case 'g':
      return createGroupStep();
    case 't':
      return createTileStep();
    case 'd':
      return createDuplicateStep();
  }
}