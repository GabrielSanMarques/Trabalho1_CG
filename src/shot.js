import * as THREE from "three";

const clock = new THREE.Clock();
const ballGeometry = new THREE.SphereGeometry(1, 20, 20);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xf0fff0 });
const speed = 100;

const createShot = (plane) => {
    let x = plane.position.x;
    let y = plane.position.y;
    let z = plane.position.z + 4;
    let shot = new THREE.Mesh(ballGeometry, ballMaterial);

    shot.position.set(x, y, z);
    return shot;
};

const moveShot = (shot) => {
    let moveDistance = speed * clock.getDelta();
    shot.translateZ(moveDistance);
};


export { createShot, moveShot };