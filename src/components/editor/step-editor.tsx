import { SetStoreFunction } from "solid-js/store";
import { BuildStep, BuildStepType, ProcItem, StoreType } from "../../Proc/model";
import { Accessor, Component, Context, createContext, For, JSXElement, Match, Switch, useContext } from "solid-js";
import LineExtrudeStepEditor from "./step/line-extrude-editor";
import { Card, Dropdown, DropdownButton, Form } from "solid-bootstrap";
import { createBuildStepOfType } from "../../Proc/proc-item";
import BaseStepEditor from "./step/base-step-editor";
import BoxStepEditor from "./step/box-editor";
import DuplicateStepEditor from "./step/duplicate-step-editor";
import GroupStepEditor from "./step/group-step-editor";

export interface MainStepEditorProps<T extends BuildStep> {
  procItemIdx: Accessor<number>;
  buildStepIdx: Accessor<number>;
  itemsSignal: [get: ProcItem<T>[], set: SetStoreFunction<ProcItem<T>[]>];
  onUpdate: () => void;
}

export interface BuildStepEditorProps {
  extraFields?: JSXElement
  sidePanel?: JSXElement
}


interface BuildStepProviderProps<T extends BuildStep> {
  BUILD_STEP: () => [[number], 'steps', number];
  buildStep: () => T;
  itemsSignal: [get: ProcItem<T>[], set: SetStoreFunction<ProcItem<T>[]>];
  onUpdate: () => void;
  children: JSXElement;
}

const BuildStepContext = createContext()
function BuildStepProvider<T extends BuildStep>(props: BuildStepProviderProps<T>) {
  return <BuildStepContext.Provider value={props}>
      {props.children}
    </BuildStepContext.Provider>
}

export function useBuildStepContext<T extends BuildStep>() {
  return useContext(BuildStepContext as Context<BuildStepProviderProps<T>>);
}


const BuildStepEditor: Component<MainStepEditorProps<BuildStep>> = (props) => {
  const { procItemIdx, buildStepIdx } = props;
  const {itemsSignal, onUpdate } = props;
  const BUILD_STEP: () => [[number], 'steps', number] = () => {
    return [[procItemIdx()], 'steps', buildStepIdx()];
  }
  const [items, setItems] =  itemsSignal;
  const procItem = () => items[procItemIdx()];
  const buildStep = () => procItem().steps[buildStepIdx()];

  const changeBuildStepType = (type: BuildStepType | null) => {
    if(type) {
      setItems(... BUILD_STEP(), createBuildStepOfType(type));
      onUpdate();
    }
  }
  const typeMenu: [string,BuildStepType][] = [
    ['Tile', 't'],
    ['Box', 'b'],
    ['Edge', 'e'],
    ['Group', 'g'],
    ['Duplicate', 'd']
  ]
  const nameForType = (type: BuildStepType) => {
    const lookup = typeMenu.find(([_,t]) => t == type);
    return lookup? lookup[0] : 'UNKNOWN';
  }

  return <Card class="build-step-editor">
    <Card.Title>
      <Form.Select value={buildStep().type} onChange={(e) => changeBuildStepType(e.target.value as BuildStepType)}>
        <For each={typeMenu}>
          {
            ([name,val]) => 
              <option value={val}>{name}</option>
          }
        </For>
      </Form.Select>
    </Card.Title>
    <Card.Body class="d-flex flex-row">
      <BuildStepProvider 
            BUILD_STEP={BUILD_STEP}
            buildStep={() => buildStep()}
            itemsSignal={itemsSignal as StoreType<any>}
            onUpdate={onUpdate}>
        <Switch>
          <Match when={buildStep().type == 'e'}>
            <LineExtrudeStepEditor />
          </Match>
          <Match when={buildStep().type == 't'}>
            <BaseStepEditor />
          </Match>
          <Match when={buildStep().type == 'b'}>
            <BoxStepEditor />
          </Match>
          <Match when={buildStep().type == 'd'}>
            <DuplicateStepEditor />
          </Match>
          <Match when={buildStep().type == 'g'}>
            <GroupStepEditor />
          </Match>
        </Switch>
      </BuildStepProvider>
    </Card.Body>
  </Card>
}
export default BuildStepEditor;