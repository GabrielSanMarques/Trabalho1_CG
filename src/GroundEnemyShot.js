import * as THREE from "three";
import { GameObject } from "./GameObject.js";

const ballGeometry = new THREE.SphereGeometry(0.6, 20, 20);
const ballMaterial = new THREE.MeshLambertMaterial({ color: "pink" });
const speed = 0.7;
const speedY = 0.2;

export class GroundEnemyShot extends GameObject {
  constructor(enemy, scene, plane) {
    super(new THREE.Mesh(ballGeometry, ballMaterial), null, scene);

    const x = enemy.positionX();
    const y = enemy.positionY();
    const z = enemy.positionZ() + 3;

    this.direction = new THREE.Vector3(x - plane.positionX(), y, z - plane.positionZ());
    this.direction.normalize();
    this.plane = plane;

    this.bb = new THREE.Sphere(this.obj.position, 0.6);
    this.obj.position.set(x, y, z);
  }

  move() {
    if(this.positionY() < this.plane.positionY())
    {
        this.obj.translateY(speedY);
    }
    else
    {
        this.obj.translateZ(this.direction.z * -speed);
        this.obj.translateX(this.direction.x * -speed);
    }
  }

}
