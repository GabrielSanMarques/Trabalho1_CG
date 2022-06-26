import * as THREE from "three";
import { GLTFLoader } from "../build/jsm/loaders/GLTFLoader.js";
import { getMaxSize } from "../libs/util/util.js";

const loader = new GLTFLoader();

const normalizeAndRescale = (obj, newScale) => {
  const scale = getMaxSize(obj);

  obj.scale.set(
    newScale * (1.0 / scale),
    newScale * (1.0 / scale),
    newScale * (1.0 / scale)
  );
  return obj;
};

export const loadGLTFFile = (
  modelPath,
  modelFolder,
  desiredScale,
  visible = true
) =>
  new Promise((resolve) => {
    loader.load(modelPath + modelFolder + "/scene.gltf", (gltf) => {
      let obj = gltf.scene;

      obj.visible = visible;
      obj.name = modelFolder;

      obj.traverse((child) => {
        if (child) {
          child.castShadow = true;
        }
      });

      obj.traverse((node) => {
        if (node.material) {
          console.log("node.material");
          node.material.side = THREE.DoubleSide;
        }
      });

      obj = normalizeAndRescale(obj, desiredScale);
      // obj = fixPosition(obj);

      resolve(obj);
    });
  });
