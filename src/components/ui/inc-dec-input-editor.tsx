import { FormControl, InputGroup } from "solid-bootstrap";
import { Component } from "solid-js";

interface IncDecInputEditorProps {
  label: string;
  count?: number;
  class?: string;
  getVal: () => [number, number, number];
  setVal: (idx: number, val: number) => void
}

const IncDecInputEditor: Component<IncDecInputEditorProps> = (prop: IncDecInputEditorProps) => {
  const { label, getVal, setVal, count } = prop;
  const inputs: [HTMLInputElement | undefined, HTMLInputElement | undefined, HTMLInputElement | undefined] = [undefined, undefined, undefined];

  const OnChange = (idx: number, val: number) => {
    setVal(idx, val);
  }

  const keys = Array(count || 3).keys();
  return <InputGroup class={prop.class} >
    <InputGroup.Text>{label}</InputGroup.Text>
    {[...keys].map(idx => (
      <FormControl ref={inputs[idx]}
        type="number"
        value={getVal()[idx]} step="0.1"
        onChange={() => OnChange(idx, parseFloat(inputs[idx]!.value))} />
    ))}
  </InputGroup>
}
export default IncDecInputEditor;