import { Component } from "solid-js";

interface IncDecInputEditorProps {
  label: string;
  count?: number;
  classList: Record<string, boolean>;
  getVal: () => [number, number, number];
  setVal: (idx: number, val: number) => void
}

const IncDecInputEditor: Component<IncDecInputEditorProps> = ({ label, getVal, setVal, count, classList }: IncDecInputEditorProps) => {
  const inputs: [HTMLInputElement | undefined, HTMLInputElement | undefined, HTMLInputElement | undefined] = [undefined, undefined, undefined];

  const OnChange = (idx: number, val: number) => {
    setVal(idx, val);
  }

  const keys = Array(count || 3).keys();
  return <div class="input-group input-group-sm" classList={classList} >
    <span class="input-group-text">{label}</span>
    {[...keys].map(idx => (
      <input ref={inputs[idx]}
        type="number" class="form-control"
        value={getVal()[idx]} step="0.1"
        onChange={() => OnChange(idx, parseFloat(inputs[idx]!.value))} />
    ))}
  </div>
}
export default IncDecInputEditor;