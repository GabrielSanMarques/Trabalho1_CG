import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";

import { createAirplane } from "./airplane.js";
import { createShot, loadShotImage } from "./shot.js";
import { Bomb } from "./Bomb.js";
import { Enemy } from "./Enemy.js";
import { SideEnemy } from "./SideEnemy.js";
import { ArcEnemy } from "./ArcEnemy.js";
import { GroundEnemy } from "./GroundEnemy.js";
import { AirEnemyShot } from "./AirEnemyShot.js";
import { GroundEnemyShot } from "./GroundEnemyShot.js";

import { createFpsStatsPanel } from "./stats.js";
import { createRenderer } from "./renderer.js";
import { createCameraHolder, createViewportHolder } from "./cameraHolder.js";
import { createGround, moveGround } from "./ground.js";
import { createDirectionalLight } from "./directionalLight.js";
import { createHeart } from "./hearts.js";

import { initCamera, InfoBox } from "../libs/util/util.js";

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const viewportCam = initCamera(new THREE.Vector3(0, 0, 0));
const stats = createFpsStatsPanel(); // To show FPS information //

const plane = await createAirplane(scene);

const ground = createGround(scene);

const hearts = createHeart(scene);

createDirectionalLight(scene);
createCameraHolder(camera, scene);

let enemies = [];
let shots = [];
let enemyShots = [];

let collisionEnabled = true;

let sideDirection;

createCameraHolder(camera, scene);
createViewportHolder(viewportCam, scene);

var game = () => {
  //Wave 1
  setTimeout(() => {
    for (var i = 0; i < 5; i++)
      enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
  }, 1000);

  //Wave 2
  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
      sideDirection *= -1;
    }
  }, 5000);

  //Wave 3
  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 10000);

  //Wave 4
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
  }, 12000);
};

await loadShotImage();

/*
let generateEnemiesInterval;

const generateEnemies = () => {
  enemies.push(new ArcEnemy(scene));

  clearInterval(generateEnemiesInterval);

  generateEnemiesInterval = setInterval(
    generateEnemies,
    THREE.MathUtils.randFloat(1, 5) * 300
  );
};
*/

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

const enemyShot = () => {
  enemies.forEach((enemy) => {
    if (enemy instanceof GroundEnemy)
      enemyShots.push(new GroundEnemyShot(enemy, scene, plane));
    else enemyShots.push(new AirEnemyShot(enemy, scene, plane));
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

const increseLife = (pts) => {
  if (plane.life < 5) {
    plane.life += pts;
    if (plane.life > 5) plane.life = 5;
    for (let i = 0; i < plane.life; i++) scene.add(hearts[i]);
  }
};

const checkCollision = () => {
  enemies = enemies.filter((enemy) => {
    let keep = true;

    if (enemy.collidesWith(plane)) {
      decreseLife(2);
      enemy.fadoutFromScene();
      keep = false;
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

const shot = async () => shots.push(await createShot(plane, scene));

const bombShot = () => shots.push(new Bomb(plane, scene));

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;

const disablePlaneCollision = () => (collisionEnabled = false);

const keyboardHandler = () => {
  const dt = clock.getDelta();

  keyboard.update();

  if (keyboard.pressed("right")) plane.moveRight(dt);
  if (keyboard.pressed("left")) plane.moveLeft(dt);
  if (keyboard.pressed("up") && plane.positionZ() >= screenUpperLimitZ)
    plane.moveForward(dt);
  if (keyboard.pressed("down") && plane.positionZ() <= screenLowerLimitZ)
    plane.moveBackward(dt);
  if (keyboard.down("ctrl")) shot(); // Missil Aereo
  if (keyboard.down("space")) bombShot(); //Misseis ar-terra
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

  //Set main camera
  renderer.setViewport(0, 0, width, height); // Reset viewport
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  renderer.setClearAlpha(1);
  renderer.clear(); // Clean the window
  renderer.render(scene, camera);

  // // Set virtual camera viewport
  var offset = 30;
  var vcWidth = 700;
  var vcHeidth = 300;
  renderer.setViewport(offset, offset, vcWidth, vcHeidth); // Set virtual camera viewport
  renderer.setScissor(offset, offset, vcWidth, vcHeidth); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearColor(0x000000, 0);
  // the default // Use a darker clear color in the small viewport
  renderer.clear(); // Clean the small viewport

  renderer.render(scene, viewportCam); // Render scene of the virtual camera
}

const render = () => {
  dualRender();
  updateShots();
  updateEnemyShots();
  updateEnemies();
  checkCollision();
  keyboardHandler();
  moveGround(ground);
  requestAnimationFrame(render);
  stats.update();
};

game();
setInterval(enemyShot, 3000);
//generateEnemiesInterval = setInterval(generateEnemies, 2000);

showControlsInfoBox();
render();
