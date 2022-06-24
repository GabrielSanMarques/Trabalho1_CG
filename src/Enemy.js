import * as THREE from "three";
import { FadoutObject } from "./FadoutObject.js";

const screenLimit = 70;
const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

export class Enemy extends FadoutObject {
  constructor(scene) {
    super(
      new THREE.Mesh(
        enemyGeometry,
        new THREE.MeshLambertMaterial({ color: "green" })
      ),
      null,
      scene
    );

    var enemyX = THREE.MathUtils.randFloat(-screenLimit, screenLimit);

    this.bb = new THREE.Sphere(this.obj.position, 1.7);
    this.speed = THREE.MathUtils.randFloat(0.5, 1);
    this.obj.position.set(enemyX, 1.5, -45);
  }

  move() {
    this.obj.translateZ(this.speed);
  }
}
