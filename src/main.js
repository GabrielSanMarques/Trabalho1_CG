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
import { createEnemy, moveEnemy } from "./enemy.js";

let generateEnemiesInterval;

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = initCamera(new THREE.Vector3(0, 0, 0));
let enemies = [];
let shots = [];

initDefaultBasicLight(scene);

const planeSpeed = 30;
let plane = createPlane();
let planeBB = new THREE.Sphere(plane.position, 1);
scene.add(plane);

let ground = createGround();
scene.add(ground);

let cameraHolder = createCamHolder();
cameraHolder.add(camera);
scene.add(cameraHolder);

const generateEnemies = () => {
  let enemyTmp = createEnemy();

  enemies.push(enemyTmp);
  scene.add(enemyTmp.obj);

  clearInterval(generateEnemiesInterval);
  generateEnemiesInterval = setInterval(
    generateEnemies,
    THREE.MathUtils.randFloat(1, 5) * 300
  );
};

const updateEnemies = () => {
  enemies.forEach((enemy) => {
    // TODO: verificar se o inimigo não saiu da tela
    // NOTE: clock.getDelta() estava dando problema para algumas funções de move
    moveEnemy(enemy);
  });
};

const updateShots = () => {
  shots.forEach((shot) => {
    // TODO: verificar se o tiro não saiu da tela
    moveShot(shot);
  });
};

const shot = () => {
  let shotTmp = createShot(plane);

  shots.push(shotTmp);
  scene.add(shotTmp.obj);
};

// FIX: G
const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.bb.intersectsSphere(planeBB)) {
      scene.remove(plane);
      console.log("Fim de jogo.");
    }

    shots = shots.filter((shot) => {
      if (shot.bb.intersectsSphere(enemy.bb)) {
        scene.remove(enemy.bb);
        scene.remove(enemy.obj);
        scene.remove(shot.obj);
        scene.remove(shot.bb);
        keep = false;
      }
      return keep;
    });
    return keep;
  });
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
  updateShots();
  updateEnemies();
  checkCollision();
  //generateEnemies();
  keyboardHandler();
  moveGround(ground);
  requestAnimationFrame(render);
};

generateEnemiesInterval = setInterval(generateEnemies, 2000);

showControlsInfoBox();
render();
