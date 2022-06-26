import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";

import { AirPlane } from "./AirPlane.js";
import { Shot } from "./Shot.js";
import { Enemy } from "./Enemy.js";

import { createFpsStatsPanel } from "./stats.js";
import { createRenderer } from "./renderer.js";
import { createCameraHolder } from "./cameraHolder.js";
import { createGround, moveGround } from "./ground.js";
import { createDirectionalLight } from "./directionalLight.js";

import { initCamera, InfoBox } from "../libs/util/util.js";

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const stats = createFpsStatsPanel(); // To show FPS information //

const planeSpeed = 40;
const plane = new AirPlane(scene);

const ground = createGround(scene);

createDirectionalLight(scene);
createCameraHolder(camera, scene);

let enemies = [];
let shots = [];

let generateEnemiesInterval;

const generateEnemies = () => {
  enemies.push(new Enemy(scene));

  clearInterval(generateEnemiesInterval);

  generateEnemiesInterval = setInterval(
    generateEnemies,
    THREE.MathUtils.randFloat(1, 5) * 300
  );
};

const updateEnemies = () => {
  enemies = enemies.filter((enemy) => {
    let keepEnemy = true;

    enemy.move();
    if (enemy.positionZ() >= 60) {
      enemy.removeFromScene();
      keepEnemy = false;
    }
    return keepEnemy;
  });
};

const updateShots = () => {
  shots = shots.filter((shot) => {
    let keepShot = true;

    shot.move();
    if (shot.positionZ() <= -45) {
      shot.removeFromScene();
      keepShot = false;
    }
    return keepShot;
  });
};

const restartGame = (timeout) =>
  setTimeout(() => window.location.reload(), timeout ?? 1000);

const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.collidesWith(plane)) {
      plane.fadoutFromScene();
      console.log("Fim de jogo.");
      restartGame();
    }

    shots = shots.filter((shot) => {
      if (shot.collidesWith(enemy)) {
        enemy.fadoutFromScene();
        shot.removeFromScene();
        keep = false;
      }
      return keep;
    });
    return keep;
  });
};

const shot = () => shots.push(new Shot(plane, scene));

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;

const keyboardHandler = () => {
  const moveDistance = planeSpeed * clock.getDelta();

  keyboard.update();

  if (keyboard.pressed("right")) plane.translateX(moveDistance);
  if (keyboard.pressed("left")) plane.translateX(-moveDistance);
  if (keyboard.pressed("up") && plane.positionZ() >= screenUpperLimitZ)
    plane.translateY(moveDistance);
  if (keyboard.pressed("down") && plane.positionZ() <= screenLowerLimitZ)
    plane.translateY(-moveDistance);
  if (keyboard.down("ctrl")) shot(); // Missil Aereo
  if (keyboard.down("space")) shot(); //Misseis ar-terra
  if (keyboard.pressed("G")) plane.disableCollision(); // Evitar Colisão
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

const render = () => {
  renderer.render(scene, camera);
  updateShots();
  updateEnemies();
  checkCollision();
  keyboardHandler();
  moveGround(ground);
  requestAnimationFrame(render);
  stats.update(); // Update FPS
};

generateEnemiesInterval = setInterval(generateEnemies, 2000);

showControlsInfoBox();
render();
