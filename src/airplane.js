import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { GameObject } from "./GameObject.js";
import { loadGLTFFile } from "./glft.js";

const planeX = 0;
const planeY = 2;
const planeZ = 35;

const planeSpeed = 40;

let _modelObj = null;

const getObject = async () => {
  if (_modelObj == null) {
    _modelObj = await loadGLTFFile(
      "../assets/objects/",
      "airplane",
      4.0,
      180,
      true
    );
  }
  return _modelObj.clone();
};

export const createAirplane = async (scene) => {
  const obj = await getObject();
  const bb = new THREE.Sphere(obj.position, 1);
  const plane = new GameObject(obj, bb, scene);

  obj.rotateY(degreesToRadians(-90));
  obj.position.set(planeX, planeY, planeZ);
  obj.castShadow = true;

  return Object.assign(plane, {
    life: 5,
    moveForward: (dt) => plane.translateX(-dt * planeSpeed),
    moveBackward: (dt) => plane.translateX(dt * planeSpeed),
    moveLeft: (dt) => plane.translateZ(dt * planeSpeed),
    moveRight: (dt) => plane.translateZ(-dt * planeSpeed),
  });
};
