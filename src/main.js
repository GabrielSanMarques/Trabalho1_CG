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
import { createCameraHolder, createViewportHolder } from "./cameraHolder.js";
import { createGround, moveGround } from "./ground.js";
import { createDirectionalLight } from "./directionalLight.js";
import { createHeart } from "./hearts.js";

import { initCamera, InfoBox } from "../libs/util/util.js";

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const viewportCam = new THREE.PerspectiveCamera(50, 48 / 7.8, 1, 500);
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
  }, 6000);

  //Wave 3
  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 11000);

  //Wave 4
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
  }, 16000);

  //Wave 5
  setTimeout(() => {
    for (var i = 0; i < 5; i++)
      enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
  }, 21000);

  setTimeout(() => {
    for (var i = 0; i < 5; i++)
      enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
  }, 23000);

  setTimeout(() => {
    for (var i = 0; i < 5; i++)
      enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
  }, 24000);

  //Wave 6
  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 30000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
      sideDirection *= -1;
    }
  }, 32000);

  //Wave 7
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new Enemy(scene, -40 + 16 * i, 0.4, plane));
  }, 37000);

  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
  }, 37000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
      sideDirection *= -1;
    }
  }, 39000);

  //Wave 8
  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  }, 44000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
      sideDirection *= -1;
    }
  }, 44000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 46000);

  //Wave 8
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  }, 51000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  }, 53000);

  setTimeout(() => {
    for (var i = 0; i < 10; i++)
      enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  }, 55000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
      sideDirection *= -1;
    }
  }, 55000);

  //Wave 9
  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 60000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 62000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 6; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 62000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 64000);

  //Wave 10
  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 8; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 69000);

  sideDirection = -1;
  setTimeout(() => {
    for (var i = 0; i < 8; i++) {
      enemies.push(new ArcEnemy(scene, 5 + 6 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 72000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 8; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 75000);

  //Wave 11
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  }, 80000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  }, 83000);

  setTimeout(() => {
    for (var i = 0; i < 10; i++)
      enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  }, 86000);

  setTimeout(() => {
    for (var i = 0; i < 10; i++)
      enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  }, 89000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  }, 92000);

  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  }, 95000);

  //Wave 12
  setTimeout(() => {
    for (var i = 0; i < 6; i++)
      enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  }, 100000);

  sideDirection = 1;
  setTimeout(() => {
    for (var i = 0; i < 8; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 102000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  }, 105000);

  sideDirection = -1;
  setTimeout(() => {
    for (var i = 0; i < 8; i++) {
      enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
      sideDirection *= -1;
    }
  }, 107000);

  setTimeout(() => {
    for (var i = 0; i < 10; i++)
      enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  }, 110000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 115000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 118000);

  setTimeout(() => {
    for (var i = 0; i < 8; i++)
      enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  }, 121000);
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

const shot = (type) => {
  if (type) shots.push(new Bomb(plane, scene));
  else shots.push(new Shot(plane, scene));
};

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
  if (keyboard.down("ctrl")) shot(0); // Missil Aereo
  if (keyboard.down("space")) shot(1); //Misseis ar-terra
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
  renderer.setClearAlpha(0);
  renderer.clear(); // Clean the window
  renderer.render(scene, camera);

  // // Set virtual camera viewport
  var offset = 30;
  var offset2 = 40;
  var vcWidth = 600;
  var vcHeight = 100;
  renderer.setViewport(offset, offset2, vcWidth, vcHeight); // Set virtual camera viewport
  renderer.setScissor(offset, offset2, vcWidth, vcHeight); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  renderer.setClearAlpha(0);
  renderer.setClearColor(0x00ffff, 0); // border color
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
