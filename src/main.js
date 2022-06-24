import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";
import {
  initRenderer,
  initCamera,
  initDefaultBasicLight,
  InfoBox,
} from "../libs/util/util.js";

import { createGround, moveGround } from "./ground.js";
import { AirPlane } from "./AirPlane.js";
import { createCameraHolder } from "./cameraHolder.js";
import { Shot } from "./Shot.js";
import { Enemy } from "./Enemy.js";
import { createDirectionalLight } from "./DirLight.js";

import Stats from "../build/jsm/libs/stats.module.js"; //
var stats = new Stats(); // To show FPS information //
stats.showPanel(0); //
document.body.appendChild(stats.dom); //

let generateEnemiesInterval;

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
//const renderer = initRenderer(); ANTIGO RENDER
let renderer = new THREE.WebGL1Renderer(); // Novo Render
document.getElementById("webgl-output").appendChild(renderer.domElement); //
renderer.setSize(window.innerWidth, window.innerHeight); //
renderer.shadowMap.enabled = true; //
renderer.shadowMap.type = THREE.VSMShadowMap; // default
renderer.shadowMap.needsUpdate = true;
//renderer.setPixelRatio(window.devicePixelRatio * 0.5); //Diminuir qualidade para aumentar FPS

const camera = initCamera(new THREE.Vector3(0, 0, 0));
let enemies = [];
let shots = [];

//initDefaultBasicLight(scene);//Antiga Luz
createDirectionalLight(scene); //Luz Direcional

const planeSpeed = 40;
const plane = new AirPlane(scene);

const ground = createGround();
ground.receiveShadow = true; //Receber sombras
scene.add(ground);

createCameraHolder(camera, scene);

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

const shot = () => shots.push(new Shot(plane, scene));

function reiniciando() {
  window.location.reload();
}

const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.collidesWith(plane)) {
      plane.fadoutFromScene();
      console.log("Fim de jogo.");
      setTimeout(reiniciando, 1000);
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

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;

const keyboardHandler = () => {
  keyboard.update();
  var moveDistance = planeSpeed * clock.getDelta();
  if (keyboard.pressed("right")) plane.translateX(moveDistance);
  if (keyboard.pressed("left")) plane.translateX(-moveDistance);
  if (keyboard.pressed("up") && plane.positionZ() >= screenUpperLimitZ)
    plane.translateY(moveDistance);
  if (keyboard.pressed("down") && plane.positionZ() <= screenLowerLimitZ)
    plane.translateY(-moveDistance);
  if (keyboard.down("ctrl")) shot(); // Missil Aereo
  if (keyboard.down("space")) shot(); //Misseis ar-terra
  if (keyboard.pressed("G")) plane.disableCollision(); // Evitar Colisão
  if (keyboard.pressed("enter")) reiniciando(); //Retornar ao Inicio
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
  stats.update(); // Update FPS
};

generateEnemiesInterval = setInterval(generateEnemies, 2000);

showControlsInfoBox();
render();
