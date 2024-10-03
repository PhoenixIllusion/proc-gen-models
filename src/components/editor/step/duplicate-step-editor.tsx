import { Component } from "solid-js";
import { DuplicateStep } from "../../../Proc/model";
import { BuildStepEditorProps, useBuildStepContext } from "../step-editor";
import BaseStepEditor from "./base-step-editor";
import { StepInputField } from "../step-input-field";

const DuplicateStepEditor: Component<BuildStepEditorProps> = 
  () => {
  const { BUILD_STEP, buildStep, itemsSignal, onUpdate } = useBuildStepContext<DuplicateStep>();
  const [_items, setItems] = itemsSignal;

  const SetBuildStepPropDim = (key: keyof DuplicateStep, val: number) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate()
  }
  const extraFields = () => {
    return (<>
    {StepInputField<DuplicateStep>('target', buildStep, SetBuildStepPropDim)}
    </>)
  }

  return <BaseStepEditor
    extraFields={extraFields()}
  ></BaseStepEditor>
}
export default DuplicateStepEditor;