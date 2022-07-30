import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";

import { createAirplane } from "./airplane.js";
import { createShot, loadShotImage } from "./shot.js";
import { Bomb } from "./Bomb.js";
import { Enemy } from "./Enemy.js";
import { SideEnemy } from "./SideEnemy.js";
import { ArcEnemy } from "./ArcEnemy.js";

import { createFpsStatsPanel } from "./stats.js";
import { createRenderer } from "./renderer.js";
import { createCameraHolder, createViewportHolder } from "./cameraHolder.js";
import { createGround, moveGround } from "./ground.js";
import { createDirectionalLight } from "./directionalLight.js";
import { createHeart } from "./hearts.js";
import { createWater } from "./water.js";

import { initCamera, InfoBox } from "../libs/util/util.js";
import {
  somTrilhaSonora,
  // somTiroAdversario,
  somColisao,
  somTiroPrincipal,
} from "./sound.js";

////////////////////
//// Constantes ////
////////////////////

const SCREEN_UPPER_LIMIT_Z = -35;
const SCREEN_LOWER_LIMIT_Z = 35;

const SHOT_CADENCE_DT = 500;

///////////////////
//// Variáveis ////
///////////////////

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const viewportCam = new THREE.PerspectiveCamera(50, 48 / 7.8, 1, 500);
const stats = createFpsStatsPanel();

const plane = await createAirplane(scene);

const ground = createGround(scene);

const hearts = createHeart(scene);

let enemies = [];
let shots = [];
let enemyShots = [];

let collisionEnabled = true;

let animationFrameRequest = undefined;

let canShot = true;
let lastShotTime = -3000;

/////////////////
//// Funções ////
/////////////////

const updateEnemies = () => {
  enemies = enemies.filter((enemy) => {
    let keepEnemy = true;

    enemy.move();
    if (
      (enemy instanceof Enemy && enemy.positionZ() >= 60) ||
      (enemy instanceof SideEnemy &&
        (enemy.positionX() >= 90 || enemy.positionX() <= -90)) ||
      (enemy instanceof ArcEnemy && enemy.destroy())
    ) {
      enemy.removeFromScene();
      keepEnemy = false;
    }
    return keepEnemy;
  });
};

const updateEnemyShots = () => {
  enemyShots = enemyShots.filter((shot) => {
    let keepShot = true;

    shot.move();
    if (
      shot.positionX() > 70 ||
      shot.positionX() < -70 ||
      shot.positionZ() < -45 ||
      shot.positionZ() > 45
    ) {
      shot.removeFromScene();
      keepShot = false;
    }
    return keepShot;
  });
};

const updateShots = () => {
  shots = shots.filter((shot) => {
    let keepShot = true;

    shot.move();
    if (shot.positionZ() <= -45 || shot.positionY() <= -10) {
      shot.removeFromScene();
      keepShot = false;
    }
    return keepShot;
  });
};

const restartGame = (timeout) =>
  setTimeout(() => window.location.reload(), timeout ?? 1000);

const decreseLife = (pts) => {
  if (collisionEnabled) {
    if (plane.life > 0) {
      plane.life -= pts;
      if (plane.life < 0) plane.life = 0;
      for (let i = plane.life; i < hearts.length; i++) {
        scene.remove(hearts[i]);
      }
      if (plane.life <= 0) {
        plane.removeFromScene();
        console.log("Fim de jogo.");
        restartGame();
      }
    }
  }
};

const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.collidesWith(plane)) {
      decreseLife(2);
      enemy.fadoutFromScene();
      keep = false;
      somColisao();
    }

    shots = shots.filter((shot) => {
      if (shot.collidesWith(enemy)) {
        enemy.fadoutFromScene();
        shot.removeFromScene();
        keep = false;
        somColisao();
      }
      return keep;
    });
    return keep;
  });

  enemyShots = enemyShots.filter((shot) => {
    let keep = true;
    if (shot.collidesWith(plane)) {
      shot.removeFromScene();
      decreseLife(1);
      keep = false;
    }
    return keep;
  });
};

const shot = async (timeStep) => {
  if (canShot || timeStep - lastShotTime > SHOT_CADENCE_DT) {
    somTiroPrincipal();
    shots.push(await createShot(plane, scene));

    lastShotTime = timeStep;
    canShot = false;
  }
};

const bombShot = () => shots.push(new Bomb(plane, scene));

const disablePlaneCollision = () => (collisionEnabled = false);

const keyboardHandler = (timeStep) => {
  const dt = clock.getDelta();

  keyboard.update();
  plane.equilibrio(dt);

  if (keyboard.pressed("right")) plane.moveRight(dt);
  if (keyboard.pressed("left")) plane.moveLeft(dt);
  if (keyboard.pressed("up") && plane.positionZ() >= SCREEN_UPPER_LIMIT_Z)
    plane.moveForward(dt);
  if (keyboard.pressed("down") && plane.positionZ() <= SCREEN_LOWER_LIMIT_Z)
    plane.moveBackward(dt);
  if (keyboard.pressed("ctrl")) shot(timeStep); // Missil Aereo

  if (keyboard.down("space")) {
    bombShot(); //Misseis ar-terra
    somTiroPrincipal();
  }
  if (keyboard.pressed("G")) disablePlaneCollision(); // Evitar Colisão
  if (keyboard.pressed("enter")) restartGame(); //Retornar ao Inicio
};

const showControlsInfoBox = () => {
  const controls = new InfoBox();

  controls.add("Plane shooter");
  controls.addParagraph();
  controls.add("Controls:");
  controls.add("* Use the arrow keys to move the plane");
  controls.add("* Use Space or Ctrl to shoot");
  controls.show();
};

function dualRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // Set main camera
  renderer.setViewport(0, 0, width, height);
  renderer.setScissorTest(false);
  renderer.setClearColor("rgb(0,70,170)");
  renderer.clear();
  renderer.render(scene, camera);

  // Set virtual camera viewport
  renderer.setViewport(0, 0, width * 0.4, height * 0.1);
  renderer.setScissor(0, 0, width * 0.4, height * 0.1);
  renderer.setScissorTest(true);

  renderer.setClearColor(0x00ff00, 0);
  if (renderer.autoclear) renderer.clear();
  renderer.render(scene, viewportCam);
}

const update = (timeStep) => {
  dualRender();
  updateShots();
  updateEnemyShots();
  updateEnemies();
  checkCollision();
  keyboardHandler(timeStep);
  moveGround(ground);
  stats.update();
};

const makeAnimationFrameRequest = () => {
  animationFrameRequest = requestAnimationFrame((timeStep) => {
    makeAnimationFrameRequest();
    update(timeStep);
  });
};

const isGamePaused = () => animationFrameRequest === undefined;

const togglePause = () => {
  if (isGamePaused()) {
    makeAnimationFrameRequest();
  } else {
    cancelAnimationFrame(animationFrameRequest);
    animationFrameRequest = undefined;
  }
};

const loadAssetsAndStart = async () => {
  await loadShotImage();

  somTrilhaSonora();
  showControlsInfoBox();
  makeAnimationFrameRequest();
};

const keydownHandler = (e) => {
  if (e.key == "p") {
    togglePause();
  }
};

const keyupHandler = (e) => {
  if (e.key == "Control") {
    canShot = true;
  }
};

///////////////////////
//// Inicialização ////
///////////////////////

window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);

createWater(scene);
createDirectionalLight(scene);
createCameraHolder(camera, scene);
createViewportHolder(viewportCam, scene);

loadAssetsAndStart();
