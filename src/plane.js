import * as THREE from "three";
import KeyboardState from '../libs/util/KeyboardState.js'
import { degreesToRadians } from "../libs/util/util.js";
import { camAngle } from "./camHolder.js";
import { createShot } from "./shot.js";

const keyboard = new KeyboardState();
const clock = new THREE.Clock();
const planeGeometry = new THREE.ConeGeometry(1, 5, 30);
const planeMaterial = new THREE.MeshLambertMaterial({ color: "red" });
const planeX = 0;
const planeY = 2;
const planeZ = 45;
const speed = 30;

const createPlane = () => {
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(degreesToRadians(-90));
  plane.position.set(planeX, planeY, planeZ);

  return plane;
};

const movePlane = (plane) => {
  const screenLimitX = 54 + Math.sin(-camAngle) * plane.position.z;
  console.log(screenLimitX);

  keyboard.update();
  var moveDistance = speed * clock.getDelta();
  if (keyboard.pressed("right") && plane.position.x <= screenLimitX) plane.translateX(moveDistance);
  if (keyboard.pressed("left") && plane.position.x >= -screenLimitX) plane.translateX(-moveDistance);
  if (keyboard.pressed("up") && plane.position.z >= -5) plane.translateY(moveDistance);
  if (keyboard.pressed("down") && plane.position.z <= 45) plane.translateY(-moveDistance);
};

const shot = (plane, shots) => {
  keyboard.update();
  if (keyboard.down("ctrl") || keyboard.down("space"))
    shots.push(createShot(plane));
};

export { createPlane, movePlane, shot };
