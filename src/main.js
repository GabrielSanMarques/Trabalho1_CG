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
import { createValley } from "./valley.js";

import { initCamera, InfoBox } from "../libs/util/util.js";
import {
  somTrilhaSonora,
  // somTiroAdversario,
  somColisao,
  somTiroPrincipal,
  somRestart,
} from "./sound.js";
import { ColladaLoader } from "../build/jsm/loaders/ColladaLoader.js";

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
var scene = new THREE.Scene();
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const viewportCam = new THREE.PerspectiveCamera(50, 48 / 7.8, 1, 500);
const stats = createFpsStatsPanel();

const plane = await createAirplane(scene);

//const ground = createGround(scene);

const hearts = createHeart(scene);

let enemies = [];
let shots = [];
let enemyShots = [];

let collisionEnabled = true;

let animationFrameRequest = undefined;
let savedTimeStep = 0;

let canShot = true;
let lastShotTime = -SHOT_CADENCE_DT;

let sideDirection;

let waveIdx = 0;
let initialTime = -1;

const waves = [
  (elapsedTime) => {
    if (elapsedTime >= 1000) {
      sideDirection = 1;
      for (var i = 0; i < 5; i++) {
        enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },

  (elapsedTime) => {
    if (elapsedTime >= 6000) {
      for (var i = 0; i < 6; i++) {
        enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },

  (elapsedTime) => {
    if (elapsedTime >= 11000) {
      for (var i = 0; i < 6; i++) {
        sideDirection = 1;
        enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },

  (elapsedTime) => {
    if (elapsedTime >= 16000) {
      for (var i = 0; i < 6; i++)
        enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
    }
    waveIdx++;
  },

  (elapsedTime) => {
    if (elapsedTime >= 21000) {
      for (var i = 0; i < 5; i++) {
        enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },

  (elapsedTime) => {
    if (elapsedTime >= 23000) {
      for (var i = 0; i < 5; i++) {
        enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 24000) {
      for (var i = 0; i < 5; i++) {
        enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 30000) {
      sideDirection = 1;
      for (var i = 0; i < 6; i++) {
        enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 32000) {
      sideDirection = 1;
      for (var i = 0; i < 6; i++) {
        enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 37000) {
      for (var i = 0; i < 6; i++) {
        enemies.push(new Enemy(scene, -40 + 16 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 37000) {
      for (var i = 0; i < 6; i++) {
        enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 39000) {
      sideDirection = 1;
      for (var i = 0; i < 6; i++) {
        enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 44000) {
      for (var i = 0; i < 8; i++) {
        enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 44000) {
      sideDirection = 1;
      for (var i = 0; i < 6; i++) {
        enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
        sideDirection *= -1;
      }
      waveIdx++;
    }
  },
  (elapsedTime) => {
    if (elapsedTime >= 46000) {
      for (var i = 0; i < 8; i++) {
        enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      }
      waveIdx++;
    }
  },
  (_) => {
    // Do nothing
    // waveIdx++;
  },
];

/////////////////
//// Funções ////
/////////////////

const game = (timeStep) => {
  if (initialTime == -1) {
    initialTime = timeStep;
  }

  const waveFn = waves[waveIdx];

  savedTimeStep = timeStep;
  waveFn(timeStep - initialTime);

  ////Wave 8
  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++)
  //    enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  //}, 51000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  //}, 53000);

  //setTimeout(() => {
  //  for (var i = 0; i < 10; i++)
  //    enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  //}, 55000);

  //sideDirection = 1;
  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++) {
  //    enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 55000);

  ////Wave 9
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 60000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 62000);

  //sideDirection = 1;
  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++) {
  //    enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 62000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 64000);

  ////Wave 10
  //sideDirection = 1;
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++) {
  //    enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 69000);

  //sideDirection = -1;
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++) {
  //    enemies.push(new ArcEnemy(scene, 5 + 6 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 72000);

  //sideDirection = 1;
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++) {
  //    enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 75000);

  ////Wave 11
  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++)
  //    enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  //}, 80000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  //}, 83000);

  //setTimeout(() => {
  //  for (var i = 0; i < 10; i++)
  //    enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  //}, 86000);

  //setTimeout(() => {
  //  for (var i = 0; i < 10; i++)
  //    enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  //}, 89000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  //}, 92000);

  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++)
  //    enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  //}, 95000);

  ////Wave 12
  //setTimeout(() => {
  //  for (var i = 0; i < 6; i++)
  //    enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
  //}, 100000);

  //sideDirection = 1;
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++) {
  //    enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 102000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
  //}, 105000);

  //sideDirection = -1;
  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++) {
  //    enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
  //    sideDirection *= -1;
  //  }
  //}, 107000);

  //setTimeout(() => {
  //  for (var i = 0; i < 10; i++)
  //    enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
  //}, 110000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 115000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 118000);

  //setTimeout(() => {
  //  for (var i = 0; i < 8; i++)
  //    enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
  //}, 121000);
};

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
  game(timeStep);
  keyboardHandler(timeStep);
  //moveGround(ground);
  stats.update();
};

const makeAnimationFrameRequest = (dt) => {
  animationFrameRequest = requestAnimationFrame((requestDt) => {
    let timeStep;

    console.log("==============================");
    if (dt === undefined) {
      console.log("Receiveng request dt");
      timeStep = requestDt;
    } else {
      console.log("***************");
      console.log("Receiveng saved DT");
      timeStep = dt;
    }
    console.log(`timeStep: ${timeStep}`);

    savedTimeStep = timeStep;

    makeAnimationFrameRequest();
    update(timeStep);
  });
};

const isGamePaused = () => animationFrameRequest === undefined;

const togglePause = () => {
  if (isGamePaused()) {
    makeAnimationFrameRequest(savedTimeStep);
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
createValley(scene);
createDirectionalLight(scene);
createCameraHolder(camera, scene);
createViewportHolder(viewportCam, scene);

/////////////////////////////////////
/// Loading Screen e Stormtrooper ///
/////////////////////////////////////

const loadingManager = new THREE.LoadingManager(() => {
  let loadingScreen = document.getElementById("loading-screen");
  loadingScreen.transition = 0;
  loadingScreen.style.setProperty("--speed1", "0");
  loadingScreen.style.setProperty("--speed2", "0");
  loadingScreen.style.setProperty("--speed3", "0");

  let button = document.getElementById("myBtn");
  button.style.backgroundColor = "Red";
  button.innerHTML = "Start";
  button.addEventListener("click", onButtonPressed);
});

loadColladaObject(loadingManager, " ../assets/stormtrooper/stormtrooper.dae");
let mixer = 0;
function loadColladaObject(manager, object) {
  const loader = new ColladaLoader(manager);
  loader.load(object, (collada) => {
    const avatar = collada.scene;
    const animations = avatar.animations;
    mixer = new THREE.AnimationMixer(avatar);
    mixer.clipAction(animations[0]).play();
    scene2.add(avatar);
  });
}

function onButtonPressed() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.transition = 0;
  loadingScreen.classList.add("fade-out");
  loadingScreen.addEventListener("transitionend", (e) => {
    const element = e.target;
    element.remove();
    loadAssetsAndStart();
  });
}

const restartGame = (timeout) => {
  scene = scene2;
  somRestart();
  setTimeout(() => window.location.reload(), timeout ?? 4000);
};

var scene2 = new THREE.Scene();
scene2.background = new THREE.Color("rgb(60, 60, 80)");
