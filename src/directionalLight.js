import * as THREE from "three";

const color = 0xffffff;
const intensity = 1.5;
const lightX = 30;
const lightY = 30;
const lightZ = 35;
const side = 50;

const createDirectionalLight = (scene) => {
  const light = new THREE.DirectionalLight(color, intensity);

  light.position.set(lightX, lightY, lightZ);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 100;
  light.shadow.camera.top = side;
  light.shadow.camera.bottom = -side;
  light.shadow.camera.left = side;
  light.shadow.camera.right = -side;
  light.shadow.bias = 0.0005;
  light.shadow.radius = 1;
  scene.add(light);

  return light;
};

export { createDirectionalLight };
