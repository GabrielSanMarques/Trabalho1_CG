import * as THREE from "three";
import { Water } from "../build/jsm/objects/Water2.js";

const params = {
  color: "#ffffff",
  scale: 4,
  flowX: 1,
  flowY: 1,
};

export const createWater = (scene) => {
  const waterGeometry = new THREE.PlaneGeometry(500, 500);

  const water = new Water(waterGeometry, {
    color: params.color,
    scale: params.scale,
    flowDirection: new THREE.Vector2(params.flowX, params.flowY),
    textureWidth: 1024,
    textureHeight: 1024,
  });

  water.position.y = -1;
  water.rotation.x = Math.PI * -0.5;
  scene.add(water);

  return water;
};
