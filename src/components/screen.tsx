import './screen.scss';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AmbientLight, Camera, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface ThreeScene {
  scene: Scene;
  camera: Camera;
  renderer: WebGLRenderer;
  canvas: HTMLCanvasElement
}

export const createScene = () => {
  const WIDTH = 1024;
  const HEIGHT = 640;

  const scene = new Scene();
  const camera = new PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new WebGLRenderer();
  renderer.domElement.classList.add('ui-screen-threejs-canvas')
  renderer.setSize(WIDTH, HEIGHT);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const light = new DirectionalLight();
  light.position.y += 3;
  light.position.z += 4;
  scene.add(light);

  const ambient = new AmbientLight();
  ambient.intensity = 0.3;
  scene.add(ambient);
  return {
    scene, camera, renderer,
    canvas: renderer.domElement
  };
}
