import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { GameObject } from "./GameObject.js";

const ballGeometry = new THREE.SphereGeometry(0.7, 20, 20);
const speed = 1.5;

export class Bomb extends GameObject {
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

    this.startZ = z;
    this.startY = y;
    this.bb = new THREE.Sphere(this.obj.position, 0.4);
    this.angle = 90;
    this.obj.position.set(x, y, z);
  }

  move() {
    this.posZ = Math.cos(degreesToRadians(this.angle));
    this.posY = Math.sin(degreesToRadians(this.angle));

    this.obj.position.z =  20 * this.posZ + this.startZ;
    this.obj.position.y =  4 * this.startY * this.posY - 7.5;

    this.angle += speed;
  }
}
