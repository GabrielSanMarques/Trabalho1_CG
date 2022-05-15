import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";

const camX = 0;
const camY = 50;
const camZ = 55;
const camAngle =  -60;

const createCamHolder = () => {
  let camHolder = new THREE.Object3D();
  camHolder.position.set(camX, camY, camZ);
  camHolder.rotateX(degreesToRadians(camAngle));

  return camHolder;
};

export { createCamHolder };
