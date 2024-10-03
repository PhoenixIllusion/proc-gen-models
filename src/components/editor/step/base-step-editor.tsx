import { Component } from "solid-js"
import InputEditor from "../../ui/input-editor"
import IncDecInputEditor from "../../ui/inc-dec-input-editor"
import SegmentButton from "../../segment-button"
import { BuildStepEditorProps, useBuildStepContext } from "../step-editor"

const BaseStepEditor: Component<BuildStepEditorProps> = (
  { sidePanel, extraFields }: BuildStepEditorProps) => {
  const { BUILD_STEP, buildStep, itemsSignal, onUpdate } = useBuildStepContext();
  const [_items, setItems] = itemsSignal;
  const SetBuildStepOffset = (offsetIndex: number, val: number) => {
    setItems(...BUILD_STEP(), 'offset', offsetIndex, val);
    onUpdate()
  }
  const SetBuildStepPropS = (key: 'rotate' | 'color', val: any) => {
    setItems(...BUILD_STEP(), key, val);
    onUpdate()
  }

  return <><div class="ms-1 p-1">
          <InputEditor
            type="color" label='Color'
            getVal={() => (buildStep().color || '')} setVal={(val) => SetBuildStepPropS('color', val)}>
          </InputEditor>
          <IncDecInputEditor
            label="Offset"
            class={'proc-item-offset'}
            getVal={() => (buildStep()!.offset || [0, 0, 0])}
            setVal={(idx, val) => SetBuildStepOffset(idx, val)}
          ></IncDecInputEditor>
          <SegmentButton
            label="Rotation"
            options={['xy', 'xz', 'yz']}
            getVal={() => (buildStep().rotate || 'xz')}
            setVal={(val) => SetBuildStepPropS('rotate', val)}
          ></SegmentButton>
          {extraFields}
        </div>
        {sidePanel}
      </>
}
export default BaseStepEditor