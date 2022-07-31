import * as THREE from "three";
import { loadTexture } from "./texture.js";
import { ROOT_PATH } from "/Trabalho1_CG/constants.js";

////////////////////
//// Constantes ////
////////////////////

const GROUND_WIDTH = 250;
const GROUND_HEIGHT = 250;
const GROUND_SPEED = -15;

const GROUND_Y = -8;

const SCREEN_LIMIT = 10;

///////////////////
//// Variáveis ////
///////////////////

const clock = new THREE.Clock();

/////////////////
//// Funções ////
/////////////////
const _setGroundInitialPos = (ground) => ground.position.set(0, GROUND_Y, 0);

const createGround = (scene) => {
  const planeGeometry = new THREE.PlaneGeometry(GROUND_WIDTH, GROUND_HEIGHT);
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper

  const planeMaterial = new THREE.MeshPhongMaterial({
    map: loadTexture(`${ROOT_PATH}/assets/textures/sand.jpg`),
  });

  const ground = new THREE.Mesh(planeGeometry, planeMaterial);

  ground.receiveShadow = true;
  ground.rotateX(-Math.PI / 2);

  if (scene) {
    scene.add(ground);
  }
  _setGroundInitialPos(ground);
  return ground;
};

const moveGround = (ground) => {
  var moveDistance = GROUND_SPEED * clock.getDelta();
  ground.translateY(moveDistance);
  if (ground.position.z >= SCREEN_LIMIT) _setGroundInitialPos(ground);
};

export { GROUND_WIDTH, GROUND_HEIGHT, GROUND_Y, createGround, moveGround };
