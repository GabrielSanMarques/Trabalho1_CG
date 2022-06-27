import * as THREE from "three";

const heartShape = new THREE.Shape();
heartShape.moveTo(2.5, 2.5);
heartShape.bezierCurveTo(2.5, 2.5, 2, 0, 0, 0);
heartShape.bezierCurveTo(-3, 0, -3, 3.5, -3, 3.5);
heartShape.bezierCurveTo(-3, 5.5, -1, 7.7, 2.5, 9.5);
heartShape.bezierCurveTo(6, 7.7, 8, 5.5, 8, 3.5);
heartShape.bezierCurveTo(8, 3.5, 8, 0, 5, 0);
heartShape.bezierCurveTo(3.5, 0, 2.5, 2.5, 2.5, 2.5);
const extrudeSettings = {
  depth: 1.6,
  bevelEnabled: true,
  bevelSegments: 1,
  steps: 1,
  bevelSize: 0.5,
  bevelThickness: 0.5,
};
const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

const createHeart = (scene) => {
  const pilha = [];
  for (var i = 0; i < 5; i++) {
    const heart = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({ color: "red" })
    );
    heart.position.set(150, 2, 0 + 12 * i);
    heart.rotateX(Math.PI / 2);
    heart.rotateZ(Math.PI / 2);
    pilha.push(heart);
    scene.add(heart);
  }
  return pilha;
};

export { createHeart };
