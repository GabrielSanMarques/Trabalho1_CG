import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
} from "../libs/util/util.js";

import { 
  createGround, 
  moveGround } from "./ground.js";
import { 
  createPlane,
  movePlane,
  shot } from "./plane.js";
import { createCamHolder } from "./camHolder.js";

let scene = new THREE.Scene();
let renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(0, 0, 0));
let enemies = [];
let shots = [];

initDefaultBasicLight(scene);

let plane = createPlane();
scene.add(plane);

let ground = createGround();
scene.add(ground);

let cameraHolder = createCamHolder();
cameraHolder.add(camera);
scene.add(cameraHolder);

const showControlsInfoBox = () => {
  let controls = new InfoBox();

  controls.add("Plane shooter");
  controls.addParagraph();
  controls.add("Controls:");
  controls.add("* Use the arrow keys to move the plane");
  controls.add("* Use Space or Ctrl to shoot");
  controls.show();
};

const render = () => {
  renderer.render(scene, camera); 
  movePlane(plane);
  shot(plane, shots);
  moveGround(ground);
  requestAnimationFrame(render);
};

showControlsInfoBox();
render();
