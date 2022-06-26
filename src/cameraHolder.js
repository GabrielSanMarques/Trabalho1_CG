import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";

const camX = 0;
const camY = 50;
const camZ = 55;
const camAngle = -50;

const createCameraHolder = (camera, scene) => {
  const camHolder = new THREE.Object3D();

  camHolder.position.set(camX, camY, camZ);
  camHolder.rotateX(degreesToRadians(camAngle));

  camHolder.add(camera);
  scene.add(camHolder);

  return camHolder;
};

export { createCameraHolder, camAngle };
