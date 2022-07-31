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

import { initCamera, InfoBox } from "../libs/util/util.js";
import { somRestart, somColisao, somTiroPrincipal } from "./sound.js";

import { Buttons } from "../libs/other/buttons.js";
var buttons = new Buttons(onButtonDown);
import { ColladaLoader } from "../build/jsm/loaders/ColladaLoader.js";

const clock = new THREE.Clock();
const keyboard = new KeyboardState();
var scene = new THREE.Scene();
//scene.background = new THREE.Color(0xffffff);
const renderer = createRenderer();

const camera = initCamera(new THREE.Vector3(0, 0, 0));
const viewportCam = new THREE.PerspectiveCamera(50, 48 / 7.8, 1, 500);
//const stats = createFpsStatsPanel(); // To show FPS information //

const ground = createGround(scene);

const hearts = createHeart(scene);

createDirectionalLight(scene);
createCameraHolder(camera, scene);

let enemies = [];
let shots = [];
let enemyShots = [];

let collisionEnabled = true;

createCameraHolder(camera, scene);
createViewportHolder(viewportCam, scene);

await loadShotImage();

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

const restartGame = (timeout) => {
  scene = scene2;
  somRestart();
  setTimeout(() => window.location.reload(), timeout ?? 4000);
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

const shot = async () => shots.push(await createShot(plane, scene));

const bombShot = () => shots.push(new Bomb(plane, scene));

const screenUpperLimitZ = -35;
const screenLowerLimitZ = 35;
const screenLeftLimitX = -35;
const screeRightLimitX = 35;

// const keyboardHandler = () => {
//   const dt = clock.getDelta();

//   keyboard.update();
//   plane.equilibrio(dt);
//   if (keyboard.pressed("right")) plane.moveRight(dt);
//   if (keyboard.pressed("left")) plane.moveLeft(dt);
//   if (keyboard.pressed("up") && plane.positionZ() >= screenUpperLimitZ)
//     plane.moveForward(dt);
//   if (keyboard.pressed("down") && plane.positionZ() <= screenLowerLimitZ)
//     plane.moveBackward(dt);
//   if (keyboard.down("ctrl")) {
//     shot(); // Missil Aereo
//     somTiroPrincipal();
//   }
//   if (keyboard.down("space")) {
//     bombShot(); //Misseis ar-terra
//     somTiroPrincipal();
//     console.log(dt);
//   }
//   if (keyboard.pressed("G")) disablePlaneCollision(); // Evitar Colisão
//   if (keyboard.pressed("enter")) restartGame(); //Retornar ao Inicio
// };

// window.addEventListener("keydown", (e) => {
//   if (e.key == "p") {
//     togglePause();
//   }
// });

// const showControlsInfoBox = () => {
//   const controls = new InfoBox();

//   controls.add("Plane shooter");
//   controls.addParagraph();
//   controls.add("Controls:");
//   controls.add("* Use the arrow keys to move the plane");
//   controls.add("* Use Space or Ctrl to shoot");
//   controls.show();
// };

function dualRender() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  //console.log(width); //1323
  //console.log(height); //1008

  //Set main camera
  renderer.setViewport(0, 0, width, height); // Reset viewport
  renderer.setScissorTest(false); // Disable scissor to paint the entire window
  //renderer.setClearAlpha(0);
  renderer.setClearColor("rgb(60, 60, 80)");
  renderer.clear(); // Clean the window
  renderer.render(scene, camera);

  // // Set virtual camera viewport
  renderer.setViewport(0, 0, width * 0.4, height * 0.1); // Set virtual camera viewport
  renderer.setScissor(0, 0, width * 0.4, height * 0.1); // Set scissor with the same size as the viewport
  renderer.setScissorTest(true); // Enable scissor to paint only the scissor are (i.e., the small viewport)
  //renderer.setClearAlpha(0);
  renderer.setClearColor(0x00ff00, 0); // border color
  if (renderer.autoclear) renderer.clear(); //Set Transparency
  renderer.render(scene, viewportCam); // Render scene of the virtual camera
}

const update = () => {
  dualRender();
  updateShots();
  updateEnemyShots();
  updateEnemies();
  checkCollision();
  keyboardHandler();
  moveGround(ground);
  //stats.update();
  updatePlane();
};

let animationFrameRequest = undefined;

const makeAnimationFrameRequest = () => {
  animationFrameRequest = requestAnimationFrame(() => {
    makeAnimationFrameRequest();
    update();
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

////////////////////////////////

let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
addJoysticks();

function updatePlane() {
  const dt = clock.getDelta();
  if (fwdValue && plane.positionZ() >= screenUpperLimitZ) {
    plane.moveForward(0.035 * fwdValue);
  }
  if (bkdValue && plane.positionZ() <= screenLowerLimitZ) {
    plane.moveBackward(0.035 * bkdValue);
  }
  if (lftValue && plane.positionX() >= screenLeftLimitX) {
    plane.moveLeft(0.035 * lftValue);
  }
  if (rgtValue && plane.positionX() <= screeRightLimitX) {
    plane.moveRight(0.035 * rgtValue);
  }
  plane.equilibrio(dt);
}

function addJoysticks() {
  let joystickL = nipplejs.create({
    zone: document.getElementById("joystickWrapper1"),
    mode: "static",
    position: { top: "-80px", left: "80px" },
  });
  joystickL.on("move", function (evt, data) {
    const forward = data.vector.y;
    const turn = data.vector.x;
    fwdValue = bkdValue = lftValue = rgtValue = 0;
    if (forward > 0) fwdValue = Math.abs(forward);
    else if (forward < 0) bkdValue = Math.abs(forward);
    if (turn > 0) rgtValue = Math.abs(turn);
    else if (turn < 0) lftValue = Math.abs(turn);
  });

  joystickL.on("end", function (evt) {
    bkdValue = 0;
    fwdValue = 0;
    lftValue = 0;
    rgtValue = 0;
  });
}

function onButtonDown(event) {
  switch (event.target.id) {
    case "Ctrl":
      shot();
      break;
    case "Space":
      bombShot();
      restartGame();
      break;
  }
}

const plane = await createAirplane(scene);

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
  });
}

var scene2 = new THREE.Scene();
scene2.background = new THREE.Color("rgb(60, 60, 80)");

//somTrilhaSonora();
makeAnimationFrameRequest();
