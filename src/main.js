import * as THREE from "three";
import KeyboardState from "../libs/util/KeyboardState.js";

import { createAirplane } from "./airplane.js";
import { createShot, loadShotImage } from "./shot.js";
import { StopWatch } from "./StopWatch.js";
import { Bomb } from "./Bomb.js";
import { Enemy } from "./Enemy.js";
import { SideEnemy } from "./SideEnemy.js";
import { ArcEnemy } from "./ArcEnemy.js";
import { AirEnemyShot } from "./AirEnemyShot.js";
import { GroundEnemy } from "./GroundEnemy.js";
import { createGroundEnemyShot } from "./GroundEnemyShot.js";

import { createFpsStatsPanel } from "./stats.js";
import { createRenderer } from "./renderer.js";
import { createCameraHolder, createViewportHolder } from "./cameraHolder.js";
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
  somTiroAdversario,
} from "./sound.js";
import { ColladaLoader } from "../build/jsm/loaders/ColladaLoader.js";

////////////////////
//// Constantes ////
////////////////////

const SCREEN_UPPER_LIMIT_Z = -35;
const SCREEN_LOWER_LIMIT_Z = 35;
const SCREEN_LEFT_LIMIT_X = -35;
const SCREEN_RIGHT_LIMIT_X = 35;

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

const stopWatch = new StopWatch();

const plane = await createAirplane(scene);

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

/////////////////
//// Funções ////
/////////////////

const prepareGameplay = () => {
  stopWatch.addTimeEventListerners([
    {
      elapsedTime: 1,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 5; i++) {
          enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
        }
      },
    },
    {
      elapsedTime: 6,
      callback: () => {
        for (var i = 0; i < 6; i++) {
          enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 11,
      callback: () => {
        for (var i = 0; i < 6; i++) {
          sideDirection = 1;
          enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 16,
      callback: () => {
        for (var i = 0; i < 6; i++)
          enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
      },
    },
    {
      elapsedTime: 21,
      callback: () => {
        for (var i = 0; i < 5; i++) {
          enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
        }
      },
    },
    {
      elapsedTime: 23,
      callback: () => {
        for (var i = 0; i < 5; i++) {
          enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
        }
      },
    },
    {
      elapsedTime: 24,
      callback: () => {
        for (var i = 0; i < 5; i++) {
          enemies.push(new Enemy(scene, -30 + 15 * i, 0.4, plane));
        }
      },
    },
    {
      elapsedTime: 30,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 6; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 32,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 6; i++) {
          enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 37,
      callback: () => {
        for (var i = 0; i < 6; i++) {
          enemies.push(new Enemy(scene, -40 + 16 * i, 0.4, plane));
        }
        for (var i = 0; i < 6; i++) {
          enemies.push(new GroundEnemy(scene, -40 + 16 * i, -60, plane));
        }
      },
    },
    {
      elapsedTime: 39,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 6; i++) {
          enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 44,
      callback: () => {
        for (var i = 0; i < 8; i++) {
          enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
        }

        sideDirection = 1;
        for (var i = 0; i < 6; i++) {
          enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 46,
      callback: () => {
        for (var i = 0; i < 8; i++) {
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
        }
      },
    },
    {
      elapsedTime: 51,
      callback: () => {
        for (var i = 0; i < 6; i++)
          enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 53,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 55,
      callback: () => {
        sideDirection = 1;
        for (let i = 0; i < 10; i++)
          enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
        for (let i = 0; i < 6; i++) {
          enemies.push(new SideEnemy(scene, -25 + 10 * i, 0.7, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 60,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      },
    },
    {
      elapsedTime: 62,
      callback: () => {
        for (var i = 0; i < 8; i++) {
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
        }
        sideDirection = 1;
        for (var i = 0; i < 6; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 8 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 64,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 8; i++)
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      },
    },
    {
      elapsedTime: 69,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 8; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 72,
      callback: () => {
        sideDirection = -1;
        for (var i = 0; i < 8; i++) {
          enemies.push(new ArcEnemy(scene, 5 + 6 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 75,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 8; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 80,
      callback: () => {
        for (var i = 0; i < 6; i++)
          enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 83,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 86,
      callback: () => {
        for (var i = 0; i < 10; i++)
          enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 89,
      callback: () => {
        for (var i = 0; i < 10; i++)
          enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 92,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 95,
      callback: () => {
        for (var i = 0; i < 6; i++)
          enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 100,
      callback: () => {
        for (var i = 0; i < 6; i++)
          enemies.push(new GroundEnemy(scene, -35 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 102,
      callback: () => {
        sideDirection = 1;
        for (var i = 0; i < 8; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 105,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new GroundEnemy(scene, -49 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 107,
      callback: () => {
        sideDirection = -1;
        for (var i = 0; i < 8; i++) {
          enemies.push(new ArcEnemy(scene, 10 + 6 * i, 0.5, sideDirection));
          sideDirection *= -1;
        }
      },
    },
    {
      elapsedTime: 110,
      callback: () => {
        for (var i = 0; i < 10; i++)
          enemies.push(new GroundEnemy(scene, -63 + 14 * i, -60, plane));
      },
    },
    {
      elapsedTime: 115,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      },
    },
    {
      elapsedTime: 118,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      },
    },
    {
      elapsedTime: 121,
      callback: () => {
        for (var i = 0; i < 8; i++)
          enemies.push(new Enemy(scene, -49 + 14 * i, 0.4, plane));
      },
    },
  ]);
};

const enemyShot = async() => {
  enemies.forEach(async(enemy) => {
    if (enemy instanceof GroundEnemy)
      enemyShots.push(await createGroundEnemyShot(enemy, scene, plane));
    else enemyShots.push(new AirEnemyShot(enemy, scene, plane));
  });
  somTiroAdversario();
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

const decreaseLife = (pts) => {
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
      decreaseLife(2);
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
      decreaseLife(1);
      somColisao();
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

  if (keyboard.pressed("right") && plane.positionX() <= SCREEN_RIGHT_LIMIT_X)
    plane.moveRight(dt);
  if (keyboard.pressed("left") && plane.positionX() >= SCREEN_LEFT_LIMIT_X)
    plane.moveLeft(dt);
  if (keyboard.pressed("up") && plane.positionZ() >= SCREEN_UPPER_LIMIT_Z)
    plane.moveForward(dt);
  if (keyboard.pressed("down") && plane.positionZ() <= SCREEN_LOWER_LIMIT_Z)
    plane.moveBackward(dt);
  if (keyboard.pressed("ctrl")) {
    shot(timeStep); // Missil Aereo
    somTiroPrincipal();
  }
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
  //moveGround(ground);
  stats.update();
};

const makeAnimationFrameRequest = () => {
  animationFrameRequest = requestAnimationFrame((dt) => {
    makeAnimationFrameRequest();
    update(dt);
  });
};

const isGamePaused = () => animationFrameRequest === undefined;

const togglePause = () => {
  if (isGamePaused()) {
    makeAnimationFrameRequest(savedTimeStep);
    stopWatch.start();
  } else {
    cancelAnimationFrame(animationFrameRequest);
    animationFrameRequest = undefined;
    stopWatch.pause();
  }
};

const loadAssetsAndStart = async () => {
  await loadShotImage();

  prepareGameplay();

  stopWatch.start();

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

stopWatch.executeOnInterval(enemyShot, 3000);

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
