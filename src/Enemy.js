import * as THREE from "three";
import { FadoutObject } from "./FadoutObject.js";
import { AirEnemyShot } from "./AirEnemyShot.js";

const screenLimit = 70;
const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

export class Enemy extends FadoutObject {
  constructor(scene, position, speed, plane) {
    super(
      new THREE.Mesh(
        enemyGeometry,
        new THREE.MeshPhongMaterial({ color: "green" })
      ),
      null,
      scene
    );

    this.plane = plane;
    this.bb = new THREE.Sphere(this.obj.position, 1.7);
    this.speed = speed;
    this.obj.position.set(position, 1.5, -45);
  }

  move() {
    this.obj.translateZ(this.speed);
  }

}
