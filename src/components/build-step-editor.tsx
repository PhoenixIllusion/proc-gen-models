import { Component } from "solid-js";
import InputEditor from "./input-edtior";
import IncDecInputEditor from "./inc-dec-input-editor";
import { BuildStep, LineExtrudeStep, ProcItem } from "../Proc/model";
import PathEditor from "./path-editor";
import { produce, SetStoreFunction } from "solid-js/store";
import { F2, F3, F4 } from "../Proc/types";
import Card from "./card";
import SegmentButton from "./segment-button";

export interface BuildStepEditorProps {
  procItemIdx: () => number;
  buildStepIdx: () => number;
  itemsSignal: [get: ProcItem<LineExtrudeStep>[], set: SetStoreFunction<ProcItem<LineExtrudeStep>[]>];
  onUpdate: (key: keyof ProcItem<BuildStep>, val: any) => void;
}

const BuildStepEditor: Component<BuildStepEditorProps> = ({ procItemIdx, buildStepIdx, itemsSignal, onUpdate }) => {
  const [items, setItems] = itemsSignal;

  const BUILD_STEP: () => [[number], 'steps', number] = () => {
    return [[procItemIdx()], 'steps', buildStepIdx()];
  }
  const BUILD_STEP_POINTS: () => [[number], 'steps', number, 'points'] = () => {
    return [...BUILD_STEP(), 'points'];
  }

  const SetBuildStepOffset = (offsetIndex: number, val: number) => {
    setItems(...BUILD_STEP(), 'offset', offsetIndex, val);
    onUpdate('steps', buildStepIdx());
  }
  const SetBuildStepPropS = (key: 'color' | 'rotate', val: string) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate('steps', buildStepIdx());
  }
  const SetBuildStepPropMinMax = (key: 'min' | 'max', val: number) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate('steps', buildStepIdx());
  }

  const SetBuildPointList = (idx: number, val: (F2 | F3 | F4)) => {
    setItems(...BUILD_STEP_POINTS(), idx, val);
    onUpdate('steps', buildStepIdx());
  }
  const InsertBuildPoint = (idx: number, val: (F2 | F3 | F4)) => {
    setItems(...BUILD_STEP_POINTS(), produce((points) => {
      points.splice(idx, 0, val);
      return points
    }));
    onUpdate('steps', buildStepIdx());
  }
  const DeleteBuildPoint = (idx: number) => {
    setItems(...BUILD_STEP_POINTS(), produce((points) => {
      points.splice(idx, 1);
      return points
    }));
    onUpdate('steps', buildStepIdx());
  }

  const buildStep = () => items[procItemIdx()].steps[buildStepIdx()];
  const pointControl = () => ({
    get: () => buildStep()!.points,
    set: SetBuildPointList,
    insert: InsertBuildPoint,
    delete: DeleteBuildPoint
  })


  return <Card parentClass="build-step-editor" class="d-flex flex-row">
    <PathEditor
      points={pointControl()}
      width={1}
      height={1}
      step={0.1}
      min={() => buildStep().min}
      max={() => buildStep().max}
    ></PathEditor>
    <div class="ms-1 p-1">
      <InputEditor
        type="color" label='Color'
        getVal={() => (buildStep().color || '')} setVal={(val) => SetBuildStepPropS('color', val)}>
      </InputEditor>
      <IncDecInputEditor
        label="Offset"
        classList={{ 'proc-item-offset': true }}
        getVal={() => (buildStep()!.offset || [0, 0, 0])}
        setVal={(idx, val) => SetBuildStepOffset(idx, val)}
      ></IncDecInputEditor>
      <InputEditor
        type="number" label='Min'
        getVal={() => '' + buildStep()!.min} setVal={(val) => SetBuildStepPropMinMax('min', parseFloat(val))}></InputEditor>
      <InputEditor
        type="number" label='Max'
        getVal={() => '' + buildStep()!.max} setVal={(val) => SetBuildStepPropMinMax('max', parseFloat(val))}></InputEditor>
      <SegmentButton
        label="Rotation"
        options={['xy', 'xz', 'yz']}
        getVal={() => (buildStep().rotate || 'xz')}
        setVal={(val) => SetBuildStepPropS('rotate', val)}
      ></SegmentButton>
    </div>
  </Card>
}
export default BuildStepEditor;