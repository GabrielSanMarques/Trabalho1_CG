import * as THREE from "three";
import { Water } from "../build/jsm/objects/Water2.js";
import { GROUND_WIDTH, GROUND_HEIGHT, GROUND_Y } from "./ground.js";

const WATER_COLOR = "rgb(0, 50, 255)";
const WATER_SCALE = 4;
const WATER_FLOW_X = 0;
const WATER_FLOW_Y = 5;

export const createWater = (scene) => {
  const waterGeometry = new THREE.PlaneGeometry(GROUND_WIDTH, GROUND_HEIGHT);

  const water = new Water(waterGeometry, {
    color: WATER_COLOR,
    scale: WATER_SCALE,
    flowDirection: new THREE.Vector2(WATER_FLOW_X, WATER_FLOW_Y),
    textureWidth: 1024,
    textureHeight: 1024,
  });

  water.position.y = GROUND_Y + 2;
  water.rotation.x = Math.PI * -0.5;
  scene.add(water);

  return water;
};
