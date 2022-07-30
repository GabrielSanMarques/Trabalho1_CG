import * as THREE from "three";

const loader = new THREE.TextureLoader();

export const loadTexture = (texturePath) => loader.load(texturePath);
