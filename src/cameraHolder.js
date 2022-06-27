import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";

const camX = 0;
const camY = 50;
const camZ = 55;
const camAngle = -50;

const viewX = 145.2;
const viewY = 13.2;
const viewZ = 26.5;
const viewAngleX = -90;
const viewAngleZ = -90;

const createCameraHolder = (camera, scene) => {
  const camHolder = new THREE.Object3D();

  camHolder.position.set(camX, camY, camZ);
  camHolder.rotateX(degreesToRadians(camAngle));

  camHolder.add(camera);
  scene.add(camHolder);

  return camHolder;
};

const createViewportHolder = (camera, scene) => {
  let viewHolder = new THREE.Object3D();
  viewHolder.position.set(viewX, viewY, viewZ);
  viewHolder.rotateX(degreesToRadians(viewAngleX));
  viewHolder.rotateZ(degreesToRadians(viewAngleZ));

  viewHolder.add(camera);
  scene.add(viewHolder);

  return viewHolder;
};

export { createCameraHolder, createViewportHolder, camAngle };
