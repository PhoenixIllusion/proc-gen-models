import { BuildStep, LineExtrudeStep, ProcItem } from "../Proc/model";
import InputEditor from "./input-edtior";
import IncDecInputEditor from "./inc-dec-input-editor";
import './proc-editor.scss';

import { Component, createSignal, For, Index, onMount, Show } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import BuildStepEditor from "./build-step-editor";
import Card from "./card";

const ITEMS: ProcItem<LineExtrudeStep>[] = [
  {
    id: '0', name: 'Obj1', offset: [0, 0, 0], color: '#00ff00', steps: [
      { type: 'e', points: [[0.5, 0], [0.5, 0.5], [-0.5, 0.5], [-0.5, 0]], min: 0, max: 1, rotate: 'xz', offset: [0, 0, 0] }]
  },
  {
    id: '1', name: 'Obj2', offset: [-3, 0, 0], color: '#ff0000', steps: [
      { type: 'e', points: [[0.5, 0], [0.5, 0.5], [-0.5, 0.5], [-0.5, 0]], min: 0, max: 1, rotate: 'yz', offset: [0, 0, 0] }]
  },
  {
    id: '2', name: 'Obj3', offset: [3, 0, 0], color: '#0000ff', steps: [
      { type: 'e', points: [[0.5, 0], [0.5, 0.5], [-0.5, 0.5], [-0.5, 0]], min: 0, max: 1, rotate: 'xy', offset: [0, 0, 0] }]
  },
];

export type OnProcItemUpdate = (item: ProcItem<BuildStep>, property: keyof ProcItem<BuildStep>, value: any) => void;
export type OnProcItemDelete = (item: ProcItem<BuildStep>) => void;
export type OnProcItemBuild = (item: ProcItem<BuildStep>) => void;
export type OnProcItemSelect = (item: ProcItem<BuildStep>) => void;

interface EditorProps {
  methods: {
    build: OnProcItemBuild;
    update: OnProcItemUpdate;
    remove: OnProcItemDelete;
    select: OnProcItemSelect;
  }
}

const ProcEditor: Component<EditorProps> = ({ methods }) => {
  const [procItemIdx, setProcItemIdx] = createSignal<number>(0);
  const [buildStepIdx, setBuildStepIdx] = createSignal<number>(0);

  const [items, setItems] = createStore<ProcItem<BuildStep>[]>(ITEMS);


  onMount(() => {
    items.forEach(item => { methods.build(item) })
  })

  const procItem = () => items[procItemIdx()]
  const buildStep = () => procItem() ? procItem().steps[buildStepIdx()] : undefined;

  const selectableButton = <T extends {}>(a: T | undefined, b: T | undefined) => {
    return {
      'list-group-item': true, active: a == b
    }
  }

  const OnSelectProcItem = (index: number) => {
    setProcItemIdx(index);
    setBuildStepIdx(0);
    methods.select(procItem())
  }
  const OnSelectBuildStep = (index: number) => {
    setBuildStepIdx(index)
  }

  const OnDeleteProcItem = (index: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const deleted = newItems.splice(index, 1);
      methods.remove(deleted[0]);
      setProcItemIdx(Math.max(procItemIdx() - 1, 0));
      return newItems;
    });
  }

  const SetProcItemProp = (key: keyof ProcItem<BuildStep>, val: string) => {
    setItems([procItemIdx()], key, val);
    methods.update(procItem(), key, val);
  }

  const SetProcItemOffset = (offsetIndex: number, val: number) => {
    setItems([procItemIdx()], 'offset', offsetIndex, val);
    methods.update(procItem(), 'offset', procItem().offset);
  }

  return (<Card parentClass='editor-pane' class="d-inline-grid">
    <ul class='list proc-items list-group'>
      <Index each={items}>{(item, idx) =>
        <li
          onClick={[OnSelectProcItem, idx]}
          classList={selectableButton(procItemIdx(), idx)}>{item().name}</li>
      }</Index>
      <li class="btn btn-secondary list-group-item">Add</li>
    </ul>
    <Show when={procItem() != undefined}>
      <Card class="proc-item-editor d-flex flex-column p-2">
        <div class='panel'>
          Edit Item Panel
          <InputEditor
            type="text" label='Name'
            getVal={() => procItem().name} setVal={(val) => SetProcItemProp('name', val)}>
          </InputEditor>
          <InputEditor
            type="color" label='Color'
            getVal={() => procItem().color} setVal={(val) => SetProcItemProp('color', val)}>
          </InputEditor>
          <IncDecInputEditor
            label="Offset"
            classList={{ 'proc-item-offset': true }}
            getVal={() => procItem().offset}
            setVal={(idx, val) => SetProcItemOffset(idx, val)}
          ></IncDecInputEditor>
        </div>
        <button class='btn btn-delete btn-danger' onClick={[OnDeleteProcItem, procItemIdx()]} >Delete</button>
      </Card>
      <ul class='list-group build-steps'>
        <For each={procItem().steps}>{
          (_item, idx) =>
            <li classList={selectableButton(buildStepIdx(), idx())}
              onClick={[OnSelectBuildStep, idx]}
            >{procItem().name}: Step #{idx() + 1}</li>
        }</For>
        <li class="btn btn-secondary list-group-item">Add</li>
      </ul>
      <Show when={buildStep() != undefined}>
        <BuildStepEditor
          procItemIdx={procItemIdx}
          buildStepIdx={buildStepIdx}
          itemsSignal={[items as ProcItem<LineExtrudeStep>[], setItems as SetStoreFunction<ProcItem<LineExtrudeStep>[]>]}
          onUpdate={(key, val) => methods.update(procItem(), key, val)}
        ></BuildStepEditor>
      </Show>
    </Show>
  </Card>)
}

export default ProcEditor;