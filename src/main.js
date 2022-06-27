import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";

import { createAirplane } from "./airplane.js";
import { Shot } from "./Shot.js";
import { Bomb } from "./Bomb.js";
import { Enemy } from "./Enemy.js";
import { SideEnemy } from "./SideEnemy.js";
import { ArcEnemy } from "./ArcEnemy.js";
import { GroundEnemy } from "./GroundEnemy.js";
import { AirEnemyShot } from "./AirEnemyShot.js";
import { GroundEnemyShot } from "./GroundEnemyShot.js";

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

const plane = await createAirplane(scene);

const ground = createGround(scene);

createDirectionalLight(scene);
createCameraHolder(camera, scene);

let enemies = [];
let shots = [];
let enemyShots = [];

var sideDirection;

createCameraHolder(camera, scene);

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
  setTimeout(
    () => {
      for(var i = 0; i < 6; i++)
        enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
    }, 12000
  ); 
};

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
    if(enemy instanceof GroundEnemy)
      enemyShots.push(new GroundEnemyShot(enemy, scene, plane));
    else
      enemyShots.push(new AirEnemyShot(enemy, scene, plane));
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
    if (shot.positionZ() <= -45 ||
        shot.positionY() <= -10) {
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
      plane.removeFromScene();
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

  enemyShots = enemyShots.filter((shot) => {
    let keep = true;
    if (shot.collidesWith(plane)) {
      shot.removeFromScene();
      plane.removeFromScene();
      console.log("Fim de jogo.");
      restartGame();
      keep = false;
    }
    return keep;
  });
};

const shot = (type) => {
  if(type)
    shots.push(new Bomb(plane, scene));
  else
    shots.push(new Shot(plane, scene));
}

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;

const keyboardHandler = () => {
  const dt = clock.getDelta();

  keyboard.update();

  if (keyboard.pressed("right")) plane.moveRight(dt);
  if (keyboard.pressed("left")) plane.moveLeft(dt);
  if (keyboard.pressed("up") && plane.positionZ() >= screenUpperLimitZ)
    plane.moveForward(dt);
  if (keyboard.pressed("down") && plane.positionZ() <= screenLowerLimitZ)
    plane.moveBackward(dt);
  if (keyboard.down("ctrl")) shot(0); // Missil Aereo
  if (keyboard.down("space")) shot(1); //Misseis ar-terra
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
