import * as THREE from "three";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
  createGroundPlaneWired,
  degreesToRadians,
} from "../libs/util/util.js";

import { createPlane } from "./plane.js";

let scene = new THREE.Scene();
let renderer = initRenderer();
let camera = initCamera(new THREE.Vector3(0, 0, 0));

initDefaultBasicLight(scene);

// Creating the aeroplane
let plane = createPlane();

scene.add(plane);

// Creating the wired plane
scene.add(createGroundPlaneWired(100, 100, 50, 50));

// Creating the camera holder
let cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

cameraHolder.position.set(0, 50, 55);
cameraHolder.rotateX(degreesToRadians(-60));

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
  renderer.render(scene, camera); // Render scene
  requestAnimationFrame(render);
};

showControlsInfoBox();
render();
