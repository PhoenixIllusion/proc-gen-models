import { Accessor, Component, createSignal, For, Index, JSX, Signal } from "solid-js";
import { BuildStep, ProcItem } from "../../Proc/model";
import { Button, Collapse, ListGroup } from "solid-bootstrap";

export interface ProcItemListProps {
  items: Accessor<ProcItem<BuildStep>[]>;
  index: Signal<number>;
  subIndex: Signal<number>

  onAddItem: ()=>void;
  onAddSubItem: ()=>void;
}

export interface ProcItemEntryProp {
  item: Accessor<ProcItem<BuildStep>>;
  onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>;
  active: (subIndex?: number) => boolean;
  onSubClick: (idx: number)=>void;
  onSubAdd: () => void;
}

const CollapseListItem: Component<ProcItemEntryProp> = ({item, onClick, onSubClick, onSubAdd, active}) => {
  const [open, setOpen] = createSignal(false)
  return  <ListGroup.Item
      class="p-0 pb=1"
      eventKey="item"
      active={active()}
      onClick={onClick}>
        <div class='ps-3 pe-1 pt-2 pb-1 d-flex flex-row align-items-center'>
            <div style={{flex: 1}}>{item().name}</div>
            <Button variant="light" onClick={[setOpen, !open()]}>{open() ? '-' : '+'}</Button>
        </div>
        <Collapse in={open()}>
          <ListGroup variant='flush'>
            <For each={item().steps}>
              {(_item, idx) => 
                <ListGroup.Item action class='ps-5'
                  onClick={[onSubClick,idx]}
                  active={active(idx())}>
                  Step #{idx()+1}
                </ListGroup.Item>
              }
            </For>
            <ListGroup.Item action class='ps-5' eventKey="add" variant="success"
              onClick={onSubAdd}>Add</ListGroup.Item>
          </ListGroup>
        </Collapse>
    </ListGroup.Item>
}

const ProcItemList: Component<ProcItemListProps> = ({
        items, index, subIndex,
        onAddItem, onAddSubItem }) => {
  const [activeIndex, onSelect] = index;
  const [activeSubIndex, onSubSelect] = subIndex;

  return <ListGroup class='proc-items'>
    <Index each={items()}>{(item, idx) =>
      <CollapseListItem
        item={item}
        active={(subI) => (activeIndex() == idx) && (subI == undefined || activeSubIndex() == subI)}
        onClick={[onSelect, idx]}
        onSubClick={(idx) => onSubSelect(idx)}
        onSubAdd={() => onAddSubItem()}
        ></CollapseListItem>
    }</Index>
    <ListGroup.Item action eventKey="add" variant="success" onClick={onAddItem}>Add</ListGroup.Item>
  </ListGroup>
}

export default ProcItemList;