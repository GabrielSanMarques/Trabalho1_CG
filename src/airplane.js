import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { GameObject } from "./GameObject.js";
import { loadGLTFFile } from "./gltf.js";

const planeX = 0;
const planeY = 2;
const planeZ = 35;
var direcao = true;
const planeSpeed = 40;

let _modelObj = null;

const getObject = async () => {
  if (_modelObj == null) {
    _modelObj = await loadGLTFFile(
      "/assets/objects/",
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
    moveLeft: (dt) => {
      direcao = true;
      plane.translateZ1(-dt * planeSpeed);
      if (obj.rotation.y <= -0.75) obj.rotateX(0.1);
      if (obj.rotation.y > -0.75) obj.rotation.y = -0.75;
      //console.log(obj.rotation.y);
    },
    moveRight: (dt) => {
      direcao = false;
      plane.translateZ1(dt * planeSpeed);
      if (obj.rotation.y <= -0.75) obj.rotateX(-0.1);
      if (obj.rotation.y > -0.75) obj.rotation.y = -0.75;
      //console.log(obj.rotation.y);
    },
    equilibrio: (dt) => {
      if (obj.rotation.y > -1.45) {
        if (direcao) obj.rotateX(-1.5 * dt);
        else obj.rotateX(1.5 * dt);
      } else obj.rotation.y = -1.55;
      //console.log(obj.rotation.y);
    },
  });
};

//Inicial y=-1.55
//Ideal y = -0.75
