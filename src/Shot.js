import * as THREE from "three";
import { GameObject } from "./GameObject.js";

const ballGeometry = new THREE.SphereGeometry(0.4, 20, 20);
const speed = -3;

export class Shot extends GameObject {
  constructor(plane, scene) {
    super(
      new THREE.Mesh(
        ballGeometry,
        new THREE.MeshPhongMaterial({ color: "yellow" })
      ),
      null,
      scene
    );

    const x = plane.positionX();
    const y = plane.positionY();
    const z = plane.positionZ() - 4;

    this.bb = new THREE.Sphere(this.obj.position, 0.4);
    this.obj.position.set(x, y, z);
  }

  move() {
    this.obj.translateZ(speed);
  }
}
