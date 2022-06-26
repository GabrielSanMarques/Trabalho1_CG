import * as THREE from "three";

export const createRenderer = () => {
  const renderer = new THREE.WebGL1Renderer();

  document.getElementById("webgl-output").appendChild(renderer.domElement); //
  renderer.setSize(window.innerWidth, window.innerHeight); //
  renderer.shadowMap.enabled = true; //
  renderer.shadowMap.type = THREE.VSMShadowMap; // default
  renderer.shadowMap.needsUpdate = true;
  //renderer.setPixelRatio(window.devicePixelRatio * 0.5); //Diminuir qualidade para aumentar FPS

  return renderer;
};
