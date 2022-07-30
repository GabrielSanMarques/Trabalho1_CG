import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { loadGLTFFile } from "./gltf.js";

const speed = 2;

let _modelObj = null;

export const shotImageIsLoaded = () => _modelObj != null;

export const getObject = async () => {
  await loadShotImage();
  return _modelObj.clone();
};

export const loadShotImage = async () => {
  if (_modelObj == null) {
    _modelObj = await loadGLTFFile("../assets/objects/", "missile", 4.0, true);
  }
};

export const createShot = async (plane, scene) => {
  const obj = await getObject();
  const bb = new THREE.Sphere(obj.position, 0.4);

  obj.rotateY(Math.PI);

  const shot = new GameObject(obj, bb, scene);

  const x = plane.positionX();
  const y = plane.positionY();
  const z = plane.positionZ() - 4;

  obj.position.set(x, y, z);

  return Object.assign(shot, {
    move: () => shot.translateZ(speed),
  });
};
