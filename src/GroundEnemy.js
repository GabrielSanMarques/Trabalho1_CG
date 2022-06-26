import * as THREE from "three";
import { FadoutObject } from "./FadoutObject.js";

const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

export class GroundEnemy extends FadoutObject {
  constructor(scene, posX, posZ, plane) {
    super(
      new THREE.Mesh(
        enemyGeometry,
        new THREE.MeshPhongMaterial({ color: "white" })
      ),
      null,
      scene
    );

    this.plane = plane;
    this.bb = new THREE.Sphere(this.obj.position, 1.7);
    this.obj.position.set(posX, -8, posZ);
    this.clock = new THREE.Clock();
  }

  move() {
    var moveDistance = 15 * this.clock.getDelta();
    this.obj.translateZ(moveDistance);
  }
}
