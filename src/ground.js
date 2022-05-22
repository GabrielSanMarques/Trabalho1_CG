import * as THREE from "three";
import { createGroundPlaneWired } from "../libs/util/util.js";

const clock = new THREE.Clock();
const width = 180;
const height = 100;
const widthSegments = 150 / 2;
const heightSegments = 100 / 2;
const speed = -15;
const screenLimit = 10;

const createGround = () => {
  let ground = createGroundPlaneWired(
    width,
    height,
    widthSegments,
    heightSegments
  );

  return ground;
};

const moveGround = (ground) => {
  var moveDistance = speed * clock.getDelta();
  ground.translateY(moveDistance);
  if (ground.position.z >= screenLimit) ground.position.set(0, 0, 0);
};

export { createGround, moveGround };
