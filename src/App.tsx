import { createScene, ThreeScene } from './components/screen';
import ProcEditor, { OnProcItemBuild, OnProcItemDelete, OnProcItemUpdate, OnProcItemSelect } from './components/proc-editor';
import { BufferGeometry, GridHelper, Mesh, Object3D } from 'three';
import { BuildStep, ProcItem } from './Proc/model';
import { buildProcItem, updateProcItem } from './Proc/proc-item';
import { Component, createSignal, onMount } from 'solid-js';

const setup = (three: ThreeScene) => {
  const { scene, renderer, camera } = three;
  const root = new Object3D();
  root.name = 'grid';
  scene.add(root);
  const size = 2;
  const divisions = size * 5;

  const gridHelperXZ = new GridHelper(size, divisions, 0xFF0000);
  root.add(gridHelperXZ);
  const gridHelperXY = new GridHelper(size, divisions, 0x00FF00);
  gridHelperXY.rotateX(Math.PI / 2)
  root.add(gridHelperXY);

  function animate() {
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}

const buildModel = (three: ThreeScene, itemMap: Map<string, Mesh>, item: ProcItem<BuildStep>) => {
  if (!itemMap.has(item.id)) {
    const obj = new Mesh(new BufferGeometry());
    itemMap.set(item.id, obj);
    three.scene.add(obj);
    buildProcItem(item, obj);
  }
}

const highlightModel = (three: ThreeScene, itemMap: Map<string, Mesh>, item: ProcItem<BuildStep>) => {
  if (itemMap.has(item.id)) {
    const obj = itemMap.get(item.id);
    const grid = three.scene.getObjectByName('grid');
    if (obj && grid) {
      grid.position.copy(obj.position);
    }
  }
}

const removeModel = (three: ThreeScene, itemMap: Map<string, Mesh>, item: ProcItem<BuildStep>) => {
  if (itemMap.has(item.id)) {
    const obj = itemMap.get(item.id)!;
    itemMap.delete(item.id);
    three.scene.remove(obj);
  }
}

const updateModels = (itemMap: Map<string, Mesh>, item: ProcItem<BuildStep>, property: keyof ProcItem<BuildStep>, _value: any) => {
  const obj = itemMap.get(item.id)!;
  updateProcItem(item, property, obj);
}

const App: Component = () => {
  const [three] = createSignal<ThreeScene>(createScene());
  const [itemMap] = createSignal<Map<string, Mesh>>(new Map())
  const { canvas } = three();

  onMount(() => {
    setup(three());
  })

  const update: OnProcItemUpdate = (item: ProcItem<BuildStep>, property: keyof ProcItem<BuildStep>, value: any) => {
    updateModels(itemMap(), item, property, value);
  }
  const build: OnProcItemBuild = (item: ProcItem<BuildStep>) => {
    buildModel(three(), itemMap(), item);
  }
  const remove: OnProcItemDelete = (item: ProcItem<BuildStep>) => {
    removeModel(three(), itemMap(), item);
  }
  const select: OnProcItemSelect = (item: ProcItem<BuildStep>) => {
    highlightModel(three(), itemMap(), item);
  }

  return (
    <>
      {canvas}
      <ProcEditor methods={{ update, build, remove, select }}></ProcEditor>
    </>
  );
};

export default App;