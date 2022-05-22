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

const planeSpeed = 40;
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
  enemies = enemies.filter((enemy) => {
    let keepEnemy = true;

    moveEnemy(enemy);
    if (enemy.obj.position.z >= 60) {
      scene.remove(enemy.obj);
      scene.remove(enemy.bb);
      keepEnemy = false;
    }
    return keepEnemy;
  });
  console.log(enemies);
};

const updateShots = () => {
  shots = shots.filter((shot) => {
    let keepShot = true;

    moveShot(shot);
    if (shot.obj.position.z <= -45) {
      scene.remove(shot.obj);
      scene.remove(shot.bb);
      keepShot = false;
    }
    return keepShot;
  });
  console.log(shots);
};

const shot = () => {
  let shotTmp = createShot(plane);

  shots.push(shotTmp);
  scene.add(shotTmp.obj);
};

function fadeOutEffect(objet) {
  var fadeEffect = setInterval(function () {
    if (!objet.material.opacity) {
      objet.material.opacity = 1;
    }
    if (objet.material.opacity > 0) {
      objet.material.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      window.location.reload();
    }
    if (objet.material.opacity == 0) {
      scene.remove(plane);
    }
  }, 1000);
}

function reiniciando() {
  window.location.reload();
}
// FIX: G
const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.bb.intersectsSphere(planeBB)) {
      fadeOutEffect(plane);
      console.log("Fim de jogo.");
      const reinicia = setTimeout(reiniciando, 6000);
    }

    shots = shots.filter((shot) => {
      if (shot.bb.intersectsSphere(enemy.bb)) {
        scene.remove(enemy.bb);
        scene.remove(enemy.obj);
        scene.remove(shot.obj);
        scene.remove(shot.bb);
        console.log(shots);
        console.log(enemies);
        keep = false;
      }
      return keep;
    });
    return keep;
  });
};

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;

const keyboardHandler = () => {
  keyboard.update();
  var moveDistance = planeSpeed * clock.getDelta();
  if (keyboard.pressed("right")) plane.translateX(moveDistance);
  if (keyboard.pressed("left")) plane.translateX(-moveDistance);
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
