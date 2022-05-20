import * as THREE from "three";

const ballGeometry = new THREE.SphereGeometry(0.4, 20, 20);
const ballMaterial = new THREE.MeshBasicMaterial({ color: "yellow" });
const speed = -3;

const createShot = (plane) => {
  let x = plane.position.x;
  let y = plane.position.y;
  let z = plane.position.z - 4;
  let shot = new THREE.Mesh(ballGeometry, ballMaterial);
  let shotBB = new THREE.Sphere(shot.position, 0.4);

  shot.position.set(x, y, z);
  return { obj: shot, bb: shotBB };
};

const moveShot = (shot) => {
  shot.obj.translateZ(speed);
};

export { createShot, moveShot };
