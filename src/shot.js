import * as THREE from "three";

const ballGeometry = new THREE.SphereGeometry(0.4, 20, 20);
const ballMaterial = new THREE.MeshBasicMaterial({ color: "yellow" });
const speed = -3;

const createShot = (plane) => {
  let x = plane.position.x;
  let y = plane.position.y;
  let z = plane.position.z - 4;
  let shot = new THREE.Mesh(ballGeometry, ballMaterial);

  shot.position.set(x, y, z);
  return shot;
};

const moveShot = (shot) => {
  shot.translateZ(speed);
};

export { createShot, moveShot };
