import { Material, Mesh, MeshStandardMaterial } from "three";
import { BuildStep, LineExtrudeStep, ProcItem } from "./model";
import { BufferGeometry } from "three";
import { LoopBuilder } from "./loop-builder";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"


const _materialMap: Record<string, Material> = {};
const getMaterial = (hexCode: string): Material => {
  if (_materialMap[hexCode]) {
    return _materialMap[hexCode];
  }
  const mat = new MeshStandardMaterial({ color: hexCode });
  return _materialMap[hexCode] = mat;
}
export function buildProcItem(item: ProcItem<BuildStep>, obj: Mesh): void {
  obj.name = item.name;
  obj.material = getMaterial(item.color);
  obj.position.set(...item.offset);

  const geometry: BufferGeometry[] = [];
  item.steps.forEach(step => {
    let geo: BufferGeometry | undefined;
    if (step.type == 'e') {
      const extrude = step as LineExtrudeStep;
      geo = LoopBuilder.buildLoop(extrude.points, extrude.min, extrude.max)
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
      geometry.push(geo);
    }
  })
  const comboGeo = BufferGeometryUtils.mergeGeometries(geometry);
  obj.geometry = comboGeo;
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
    const geometry: BufferGeometry[] = [];
    item.steps.forEach(step => {
      if (step.type == 'e') {
        const exLine = step as LineExtrudeStep;
        const geo = LoopBuilder.buildLoop(exLine.points, exLine.min, exLine.max)
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
        geometry.push(geo);
      }
    })
    const comboGeo = BufferGeometryUtils.mergeGeometries(geometry);
    obj.geometry = comboGeo;
  }
}