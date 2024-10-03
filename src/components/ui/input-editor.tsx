import { FormControl, InputGroup } from "solid-bootstrap";
import { Component } from "solid-js";

interface InputEditorProps {
  label: string;
  type: string;
  step?: number;
  getVal: () => string;
  setVal: (val: string) => void
}

const InputEditor: Component<InputEditorProps> = ({ label, type, step, getVal, setVal }: InputEditorProps) => {
  let input: HTMLInputElement | undefined;

  return <InputGroup class="input-group-sm">
    <InputGroup.Text>{label}</InputGroup.Text>
    <FormControl ref={input} type={type}
      step={step} class="form-control" aria-label={label} value={getVal()} onBlur={() => setVal(''+input?.value)} />
  </InputGroup>
}

export default InputEditor;