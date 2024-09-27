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

  return <><div class="input-group input-group-sm">
    <span class="input-group-text">{label}</span>
    <input ref={input} type={type} step={step} class="form-control" aria-label={label} value={getVal()} onBlur={[setVal, input?.value]} />
  </div></>
}

export default InputEditor;