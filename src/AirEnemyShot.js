import * as THREE from "three";
import { GameObject } from "./GameObject.js";

const ballGeometry = new THREE.SphereGeometry(0.4, 20, 20);
const ballMaterial = new THREE.MeshLambertMaterial({ color: "light blue" });
const speed = 1;

export class AirEnemyShot extends GameObject {
  constructor(enemy, scene, plane) {
    super(new THREE.Mesh(ballGeometry, ballMaterial), null, scene);

    const x = enemy.positionX();
    const y = enemy.positionY();
    const z = enemy.positionZ() + 3;

    this.direction = new THREE.Vector3(x - plane.positionX(), y, z - plane.positionZ());
    this.direction.normalize();

    this.bb = new THREE.Sphere(this.obj.position, 0.4);
    this.obj.position.set(x, y, z);
  }

  move() {
    this.obj.translateZ(this.direction.z * -speed);
    this.obj.translateX(this.direction.x * -speed);
  }

}
