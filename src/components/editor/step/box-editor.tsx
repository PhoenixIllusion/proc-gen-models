import { Component } from "solid-js";
import { BoxStep } from "../../../Proc/model";
import { BuildStepEditorProps, useBuildStepContext } from "../step-editor";
import BaseStepEditor from "./base-step-editor";
import { StepInputField } from "../step-input-field";
import { Form, InputGroup } from "solid-bootstrap";

const BoxStepEditor: Component<BuildStepEditorProps> = 
  () => {
  const { BUILD_STEP, buildStep, itemsSignal, onUpdate } = useBuildStepContext<BoxStep>();
  const [_items, setItems] = itemsSignal;

  const SetBuildStepPropDim = (key: keyof BoxStep, val: number) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate()
  }

  const SetBuildStepSide = (idx: number, val: boolean) => {
    setItems(...BUILD_STEP(), 'sides', idx, val ? 1: 0);
    onUpdate()  
  }

  const IsChecked = (e: {target: HTMLInputElement }) => e.target.checked;
  const CurChecked = (idx: number) => buildStep().sides[idx] == 1;

  const SIDES = ['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'];
  const SideCheckBox = (idx: number) => {
    return <Form.Check inline label={SIDES[idx]}
      checked={CurChecked(idx)}
      onChange={(e) => SetBuildStepSide(idx, IsChecked(e))}
      type="checkbox" />
  }

  const dimFields = () => {
    return (<>
    {StepInputField<BoxStep>('width', buildStep, SetBuildStepPropDim)}
    {StepInputField<BoxStep>('height', buildStep, SetBuildStepPropDim)}
    {StepInputField<BoxStep>('depth', buildStep, SetBuildStepPropDim)}
      <InputGroup>
        { SIDES.map((_,i) => SideCheckBox(i))}
      </InputGroup>
    </>)
  }

  return <BaseStepEditor
    extraFields={dimFields()}
  ></BaseStepEditor>
}
export default BoxStepEditor;