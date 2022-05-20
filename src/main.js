import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
} from "../libs/util/util.js";

import { createGround, moveGround } from "./ground.js";
import { createPlane } from "./plane.js";
import { createCamHolder, camAngle } from "./camHolder.js";
import { createShot, moveShot } from "./shot.js";

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 0, 0));
/* let enemies = []; */
let shots = [];

initDefaultBasicLight(scene);

const planeSpeed = 30;
let plane = createPlane();
scene.add(plane);

let ground = createGround();
scene.add(ground);

let cameraHolder = createCamHolder();
cameraHolder.add(camera);
scene.add(cameraHolder);

const generateEnemies = () => {
  // TODO: bora Marcelo faz as pazes com o git
};

const checkCollision = () => {
  // TODO: bora Marcelo faz as pazes com o git
};

const shot = () => {
  let shotTmp = createShot(plane);

  shots.push(shotTmp);
  scene.add(shotTmp);
};

const screenUpperLimitZ = -5;
const screenLowerLimitZ = 45;

const keyboardHandler = () => {
  const screenLimitX = 54 + Math.sin(-camAngle) * plane.position.z;

  keyboard.update();
  var moveDistance = planeSpeed * clock.getDelta();
  if (keyboard.pressed("right") && plane.position.x <= screenLimitX)
    plane.translateX(moveDistance);
  if (keyboard.pressed("left") && plane.position.x >= -screenLimitX)
    plane.translateX(-moveDistance);
  if (keyboard.pressed("up") && plane.position.z >= screenUpperLimitZ)
    plane.translateY(moveDistance);
  if (keyboard.pressed("down") && plane.position.z <= screenLowerLimitZ)
    plane.translateY(-moveDistance);
  if (keyboard.down("ctrl") || keyboard.down("space")) shot();
};

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
  shots.forEach((shot) => moveShot(shot));
  checkCollision();
  generateEnemies();
  keyboardHandler();
  moveGround(ground);
  requestAnimationFrame(render);
};

showControlsInfoBox();
render();
