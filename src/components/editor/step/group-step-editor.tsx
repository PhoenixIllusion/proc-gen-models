import { Component } from "solid-js";
import { GroupStep } from "../../../Proc/model";
import { BuildStepEditorProps, useBuildStepContext } from "../step-editor";
import BaseStepEditor from "./base-step-editor";
import InputEditor from "../../ui/input-editor";
import { produce } from "solid-js/store";

const GroupStepEditor: Component<BuildStepEditorProps> = 
  () => {
  const { BUILD_STEP, buildStep, itemsSignal, onUpdate } = useBuildStepContext<GroupStep>();
  const [_items, setItems] = itemsSignal;

  const SetChildren = (key: 'children', val: number[]) => {
    setItems(...BUILD_STEP(), key, produce((prev) => {
      prev.length = 0;
      prev.push(... val);
      return prev;
    }));
    onUpdate()
  }

  const getVal = () => {
    return buildStep().children.join(',');
  }
  const setVal = (str: string): number[] => {
    return str.split(/[\s,]+/).map(x => parseInt(x, 10))
  }

  const extraFields = () => {
    return (<InputEditor
      type="text" label='Group'
      getVal={() => getVal()}
      setVal={(val) => SetChildren('children', setVal(val))}></InputEditor>)
  }

  return <BaseStepEditor
    extraFields={extraFields()}
  ></BaseStepEditor>
}
export default GroupStepEditor;