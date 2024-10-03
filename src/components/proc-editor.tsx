import { BoxStep, BuildStep, LineExtrudeStep, ProcItem } from "../Proc/model";
import InputEditor from "./ui/input-editor";
import IncDecInputEditor from "./ui/inc-dec-input-editor";
import './proc-editor.scss';

import * as DB from '../Proc/store';

import { Component, createEffect, createSignal, For, Index, onMount, Show } from "solid-js";
import { createStore, SetStoreFunction, unwrap } from "solid-js/store";
import LineExtrudeStepEditor from "./editor/step/line-extrude-editor";
import { Card } from "solid-bootstrap";
import ProcItemList from "./editor/list";
import BuildStepEditor from "./editor/step-editor";
import { createBuildStepOfType } from "../Proc/proc-item";

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

interface EditorPropCallbacks {
    update: OnProcItemUpdate;
    remove: OnProcItemDelete;
    select: OnProcItemSelect;
}

interface EditorProps {
  methods: EditorPropCallbacks
}

const ProcEditor: Component<EditorProps> = (props) => {
  const [procItemIdx, setProcItemIdx] = createSignal<number>(0);
  const [buildStepIdx, setBuildStepIdx] = createSignal<number>(0);

  const [items, setItems] = createStore<ProcItem<BuildStep>[]>([]);

  const methods = new Proxy(props.methods, {
    get(target: EditorPropCallbacks, prop: keyof EditorPropCallbacks) {
      switch(prop) {
        case 'update': {
          const method: OnProcItemUpdate = (item, key, value) => {
            DB.updateItem(unwrap(item));
            target[prop](item, key, value);
          }
          return method;
        }
        case 'remove':{
          const method: OnProcItemDelete = (item) => {
            DB.deleteItem(unwrap(item));
            target[prop](item);
          }
          return method;
        }
      }
      return target[prop];
    }
  })

  onMount(() => {
    DB.getItems().then(items => {
      items.forEach(item => methods.update(item, 'id', item.id));
      setItems(items);
   });
  })

  const procItem = () => items[procItemIdx()]
  const buildStep = () => procItem() ? procItem().steps[buildStepIdx()] : undefined;

  createEffect(() => {
    setBuildStepIdx(0);
    methods.select(procItem())
  })
  const OnDeleteProcItem = (index: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const deleted = newItems.splice(index, 1);
      methods.remove(deleted[0]);
      setProcItemIdx(Math.max(procItemIdx() - 1, 0));
      return newItems;
    });
  }
  const AddProcItem = () => {
    const item: ProcItem<BuildStep> = {
      id: ''+(new Date().getTime()),
      name: '(new Item)',
      offset:[0,0,0],
      color: '#ffffff',
      steps: []
    }
    const index = items.length;
    setItems([index], item);
    setProcItemIdx(index);
    methods.update(item, 'id', item.id);
  }
  const AddBuildStep = () => {
    const index = procItem().steps.length;
    setItems([procItemIdx()], 'steps', index, createBuildStepOfType('e'));
    setBuildStepIdx(index);
  }

  const SetProcItemProp = (key: keyof ProcItem<BuildStep>, val: string) => {
    setItems([procItemIdx()], key, val);
    methods.update(procItem(), key, val);
  }

  const SetProcItemOffset = (offsetIndex: number, val: number) => {
    setItems([procItemIdx()], 'offset', offsetIndex, val);
    methods.update(procItem(), 'offset', procItem().offset);
  }

  return (<Card class='editor-pane'>
      <Card.Body class="d-inline-grid">
    <ProcItemList
      items={() => items}
      index={[procItemIdx, setProcItemIdx]}
      subIndex={[buildStepIdx, setBuildStepIdx]}
      onAddItem={AddProcItem}
      onAddSubItem={AddBuildStep}>
    </ProcItemList>
    <Show when={procItem() != undefined}>
      <Card class="proc-item-editor d-flex flex-column p-2">
        <Card.Body>
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
            class={'proc-item-offset'}
            getVal={() => procItem().offset}
            setVal={(idx, val) => SetProcItemOffset(idx, val)}
          ></IncDecInputEditor>
        </div>
        <button class='btn btn-delete btn-danger' onClick={[OnDeleteProcItem, procItemIdx()]} >Delete</button>
        </Card.Body>
      </Card>
      <Show when={buildStep() != undefined}>
        <BuildStepEditor
          procItemIdx={procItemIdx}
          buildStepIdx={buildStepIdx}
          itemsSignal={[items, setItems]}
          onUpdate={() => methods.update(procItem(), 'steps', buildStepIdx())}
        ></BuildStepEditor>
      </Show>
    </Show>
    </Card.Body>
  </Card>)
}

export default ProcEditor;