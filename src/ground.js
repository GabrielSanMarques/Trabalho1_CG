import * as THREE from "three";
import { createGroundPlaneWired } from "../libs/util/util.js";

const clock = new THREE.Clock();
const width = 250;
const height = 200;
const widthSegments = 250 / 2;
const heightSegments = 200 / 2;
const speed = -15;
const screenLimit = 10;

const createGround = (scene) => {
  const ground = createGroundPlaneWired(
    width,
    height,
    widthSegments,
    heightSegments
  );

  if (scene) {
    scene.add(ground);
  }

  ground.position.set(0, -8, 0);
  ground.receiveShadow = true;

  return ground;
};

const moveGround = (ground) => {
  var moveDistance = speed * clock.getDelta();
  ground.translateY(moveDistance);
  if (ground.position.z >= screenLimit) ground.position.set(0, -8, 0);
};

export { createGround, moveGround };
