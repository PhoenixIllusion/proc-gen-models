import { BufferAttribute, BufferGeometry } from "three";
import { F2, F3, F4 } from "./types";

const UDefCheck = (val: number | undefined, fallback: number): number => {
  return val !== undefined ? val : fallback;
}

export class LoopBuilder {
  static buildLoop(points: (F2 | F3 | F4)[], min: number, max: number): BufferGeometry {
    const vertices: F3[] = [];
    const indices: F3[] = [];
    const uv: F2[] = [];
    let vIdx = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0, zU0, zL0] = points[i];
      const [x1, y1, zU1, zL1] = points[i + 1];
      const coords: F3[] = [
        [x0, y0, UDefCheck(zL0, min)],
        [x1, y1, UDefCheck(zL1, min)],
        [x1, y1, UDefCheck(zU1, max)],
        [x0, y0, UDefCheck(zU0, max)]
      ];
      vertices.push(...coords);
      uv.push([0, 0], [1, 0], [1, 1], [0, 1]);
      indices.push([vIdx, vIdx + 1, vIdx + 2])
      indices.push([vIdx + 2, vIdx + 3, vIdx])
      vIdx += 4;
    }
    const geometry = new BufferGeometry();
    geometry.setIndex(indices.flat());
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices.flat()), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uv.flat()), 2));
    geometry.computeVertexNormals();
    return geometry;
  }
}
