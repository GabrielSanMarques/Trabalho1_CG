import * as THREE from "three";
import { FadoutObject } from "./FadoutObject.js";

const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

export class SideEnemy extends FadoutObject {
  constructor(scene, position, speed, direction) {
    super(
      new THREE.Mesh(
        enemyGeometry,
        new THREE.MeshLambertMaterial({ color: "blue" })
      ),
      null,
      scene
    );

    this.bb = new THREE.Sphere(this.obj.position, 1.7);
    this.speed = speed;
    this.direction = direction;

    this.obj.position.set(-80 * direction, 1.5, position);
  }

  move() {
    this.obj.translateX(this.speed * this.direction);
  }
}