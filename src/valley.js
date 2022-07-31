import * as THREE from "three";
import { GROUND_WIDTH, GROUND_HEIGHT, GROUND_Y } from "./ground.js";
import { loadTexture } from "./texture.js";


export const createValley = (scene) => {
    const map = loadTexture("assets/textures/valley/map.png");
    const disMap = loadTexture("assets/textures/valley/height_map.png");
    const normalMap = loadTexture("assets/textures/valley/normal_map.jpg");
    const roughMap = loadTexture("assets/textures/valley/roughness_map.png")

    const valleyGeometry = new THREE.PlaneBufferGeometry(GROUND_WIDTH / 1.6, GROUND_HEIGHT / 1.8, 300, 300);
    const valley = new THREE.Mesh(valleyGeometry,
        new THREE.MeshStandardMaterial({
            color: '#fff',
            map: map,
            displacementMap: disMap,
            displacementScale: 25,
            //roughnessMap: roughMap,
            normalMap: normalMap,
            wireframe: false,
        }));
    valley.castShadow = true;
    valley.receiveShadow = true;


    valley.position.y = GROUND_Y - 5;
    valley.position.x = 0;
    valley.rotation.x = - Math.PI / 2;
    scene.add(valley);

    return valley;
};
