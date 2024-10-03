import { BuildStep } from "../../Proc/model";
import InputEditor from "../ui/input-editor";

const capsString = (str: string) => str.charAt(0).toUpperCase()+str.substring(1);

export function StepInputField<T extends BuildStep>(key: keyof T, buildStep: () => T, setVal: (key: keyof T, val: number)=>void) {
  return <InputEditor
      type="number" label={capsString(key as string)}
      getVal={() => '' + buildStep()[key]}
      setVal={(val) => setVal(key, parseFloat(val))}></InputEditor>
}
