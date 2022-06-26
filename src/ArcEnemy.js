import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { FadoutObject } from "./FadoutObject.js";

const enemyGeometry = new THREE.BoxGeometry(3, 3, 3);

export class ArcEnemy extends FadoutObject {
  constructor(scene, radius, speed, direction) {
    super(
      new THREE.Mesh(
        enemyGeometry,
        new THREE.MeshLambertMaterial({ color: "red" })
      ),
      null,
      scene
    );
    
    this.direction = direction;
    this.angle = -180 * direction;
    this.radius = radius;
    this.speed = speed;
    this.bb = new THREE.Sphere(this.obj.position, 1.7);
    this.obj.position.set(-90 * direction, 1.5, -35);
  }

  move() {
    this.posX = Math.cos(degreesToRadians(this.angle));
    this.posZ = Math.sin(degreesToRadians(this.angle));

    this.obj.position.x = 90 * this.direction * this.posX;
    this.obj.position.z = -35 * this.direction * this.posZ - this.radius;

    this.angle += this.speed * this.direction;
  }

  getRadius() {
    return this.radius;
  }

  destroy() {
    if (this.direction == 1)
    {
      if (this.angle >= 0) return true;
    }
    else
    {
      if (this.angle <= 0) return true;
    }
    return false;
  }
}
