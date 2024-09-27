import { Component, createMemo, createSignal } from "solid-js";
import { F2, F3, F4 } from "../Proc/types";
import './path-editor.scss';
import InputEditor from "./input-edtior";

export interface PathEditorProps {
  width: number;
  height: number;
  step: number;

  min: () => number;
  max: () => number;

  points: {
    get: () => (F2 | F3 | F4)[];
    set: (id: number, v: (F2 | F3 | F4)) => void;
    insert: (id: number, v: (F2 | F3 | F4)) => void;
    delete: (id: number) => void;
  }
}

const range = (start: number, total: number, step: number) => Array(total / step + 1).fill(0).map((_, i) => start + i * step);

const component: Component<PathEditorProps> = ({ width, height, step, min, max, points }) => {
  const [controlPoint, setControlPoint] = createSignal<number>(0);

  const curPoint = () => points.get()[controlPoint()];

  const modifyPoint = (fn: (v: F2 | F3 | F4) => F4) => {
    const idx = controlPoint();
    if (idx >= 0 && idx < points.get().length) {
      const old = curPoint();
      points.set(idx, fn(old));
    }
  }
  const setLinePoint = (x: number, y: number) => {
    modifyPoint(old => {
      return [x, y, old[2], old[3]] as F4
    })
  }
  const setPointMinMax = (key: 'min' | 'max', val: number | undefined) => {
    modifyPoint(old => {
      const [x, y, mx, mn] = old;
      if (key == 'max') {
        return [x, y, val, mn] as F4
      }
      return [x, y, mx, val] as F4
    })
  }

  const pointMemo = createMemo(() => {
    return <>
      <path d={`M 0 ${-height} 0 ${height}`} stroke-width={0.01} stroke='green'></path>
      <path d={`M ${-width} 0 ${width} 0`} stroke-width={0.01} stroke='red'></path>
      {range(-height / 2, height, step).map(y => range(-width / 2, width, step).map(x => {
        return (<circle class='p' cx={x} cy={y} r={0.02} onClick={() => setLinePoint(x, y)} ></circle>)
      }))}</>
  })

  const viewBox = `${-(width / 2 + step)} ${-(height / 2 + step)} ${width + 2 * step} ${height + 2 * step}`

  const line = () => {
    return <path d={'M ' + points.get().map(([x, y]) => `${x} ${y} `).join('')} class='line'></path>
  }

  const controlPoints = () => {
    return points.get().map(([x, y], i) => {
      return (<circle class='control-point' classList={{ active: i == controlPoint() }}
        cx={x} cy={y} r={0.04} onClick={[setControlPoint, i]}></circle>)
    })
  }

  const deltaSelectedPoint = (delta: -1 | 1) => {
    const len = points.get().length;
    const idx = (controlPoint() + delta + len) % len;
    setControlPoint(idx);
  }

  const insertControlPoint = () => {
    const len = points.get().length;
    if (len == 0) {
      points.insert(0, [0, 0]);
      return;
    }

    const activePoint = controlPoint();
    const pointA = points.get()[activePoint];
    const pointB = points.get()[activePoint + 1] || [pointA[0] + 2 * step, pointA[1]];

    points.insert(activePoint + 1, [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2]);
    setControlPoint(activePoint + 1);
  }

  const deleteControlPoint = () => {
    const activePoint = controlPoint();
    points.delete(controlPoint())
    setControlPoint(Math.max(activePoint - 1, 0));
  }

  const UnDefCheck = (val: number | undefined, fallback: number) => val == undefined ? fallback : val;

  return (
    <div class='path-editor'>
      <svg xmlns="http://www.w3.org/2000/svg" style="background: #333333" width="300px" height="300px" viewBox={viewBox}
      ><g transform={'scale(-1,1)'}>
          {pointMemo()}
          {line()}
          {controlPoints()}
        </g>
      </svg>
      <div class='buttons'>
        <button onClick={[deltaSelectedPoint, -1]}>&lt;&lt;</button>
        <button onClick={[deltaSelectedPoint, +1]}>&gt;&gt;</button>
        <button onClick={() => insertControlPoint()}>Add</button>
        <button onClick={() => deleteControlPoint()}>Delete</button>
      </div>
      <InputEditor
        type="number" label='Min'
        step={step}
        getVal={() => '' + UnDefCheck(curPoint()[3], min())} setVal={(val) => setPointMinMax('min', val == '' ? undefined : parseFloat(val))}></InputEditor>
      <InputEditor
        type="number" label='Max'
        step={step}
        getVal={() => '' + UnDefCheck(curPoint()[2], max())} setVal={(val) => setPointMinMax('max', val == '' ? undefined : parseFloat(val))}></InputEditor>
    </div>
  )
}
export default component;