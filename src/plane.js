import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";

const planeGeometry = new THREE.ConeGeometry(1, 5, 30);
const planeMaterial = new THREE.MeshLambertMaterial({ color: "red" });

const createPlane = () => {
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(degreesToRadians(-90));

  return plane;
};

export { createPlane };
