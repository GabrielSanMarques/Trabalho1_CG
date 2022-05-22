import * as THREE from "three";

const screenLimit = 70;
const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

const createEnemy = () => {
  const enemyMaterial = new THREE.MeshLambertMaterial({ color: "green" });
  var enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
  var enemyX = THREE.MathUtils.randFloat(-screenLimit, screenLimit);
  enemy.material.transparent = true;
  enemy.position.set(enemyX, 1.5, -45);

  let enemyBB = new THREE.Sphere(enemy.position, 1.7);

  return { obj: enemy, speed: THREE.MathUtils.randFloat(0.5, 1), bb: enemyBB };
};

const moveEnemy = (enemy) => {
  enemy.obj.translateZ(enemy.speed);
};

export { createEnemy, moveEnemy };
