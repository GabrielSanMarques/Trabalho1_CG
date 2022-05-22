import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";

const planeGeometry = new THREE.ConeGeometry(1, 5, 30);
const planeMaterial = new THREE.MeshLambertMaterial({ color: "red" });
const planeX = 0;
const planeY = 2;
const planeZ = 35;

const createPlane = () => {
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(degreesToRadians(-90));
  plane.position.set(planeX, planeY, planeZ);

  return plane;
};

export { createPlane };
