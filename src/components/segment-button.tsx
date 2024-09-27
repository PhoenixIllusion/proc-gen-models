import { Component } from "solid-js";

interface SegmentButtonProps {
  label: string;
  options: string[];
  getVal: () => string;
  setVal: (val: string) => void
}

const SegmentButton: Component<SegmentButtonProps> = ({ label, options, getVal, setVal }: SegmentButtonProps) => {
  return <div class="input-group">
    <span class="input-group-text">{label}</span>
    <ul class="list-group list-group-horizontal">
      {
        options.map(val => {
          return <li class='list-group-item' classList={{ active: getVal() == val }} onClick={[setVal, val]} >{val}</li>
        })
      }
    </ul>
  </div>
}

export default SegmentButton;