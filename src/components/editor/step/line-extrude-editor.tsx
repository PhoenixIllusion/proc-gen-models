import { Component } from "solid-js";
import { LineExtrudeStep } from "../../../Proc/model";
import PathEditor from "../path-editor";
import { produce } from "solid-js/store";
import { F2, F3, F4 } from "../../../Proc/types";
import { BuildStepEditorProps, useBuildStepContext } from "../step-editor";
import BaseStepEditor from "./base-step-editor";
import { StepInputField } from "../step-input-field";

const LineExtrudeStepEditor: Component<BuildStepEditorProps> = 
  (props) => {
  const { BUILD_STEP, buildStep, itemsSignal, onUpdate } = useBuildStepContext<LineExtrudeStep>();
  const [_items, setItems] = itemsSignal;

  const BUILD_STEP_POINTS: () => [[number], 'steps', number, 'points'] = () => {
    return [...BUILD_STEP(), 'points'];
  }

  const SetBuildStepPropMinMax = (key: keyof LineExtrudeStep, val: number) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate()
  }

  const SetBuildPointList = (idx: number, val: (F2 | F3 | F4)) => {
    setItems(...BUILD_STEP_POINTS(), idx, val);
    onUpdate()
  }
  const InsertBuildPoint = (idx: number, val: (F2 | F3 | F4)) => {
    setItems(...BUILD_STEP_POINTS(), produce((points) => {
      points.splice(idx, 0, val);
      return points
    }));
    onUpdate()
  }
  const DeleteBuildPoint = (idx: number) => {
    setItems(...BUILD_STEP_POINTS(), produce((points) => {
      points.splice(idx, 1);
      return points
    }));
    onUpdate()
  }

  const pointControl = () => ({
    get: () => buildStep()!.points,
    set: SetBuildPointList,
    insert: InsertBuildPoint,
    delete: DeleteBuildPoint
  })

  const minMaxFields = () => {
    return <>
      {StepInputField<LineExtrudeStep>('min', buildStep, SetBuildStepPropMinMax)}
      {StepInputField<LineExtrudeStep>('max', buildStep, SetBuildStepPropMinMax)}
    </>
  }

  return <BaseStepEditor
    sidePanel={<PathEditor
      points={pointControl()}
      width={1}
      height={1}
      step={0.1}
      min={() => buildStep().min}
      max={() => buildStep().max}
    ></PathEditor>}
    extraFields={minMaxFields()}
  ></BaseStepEditor>
}
export default LineExtrudeStepEditor;