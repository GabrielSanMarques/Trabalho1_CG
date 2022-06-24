import * as THREE from "three";
import { degreesToRadians } from "../libs/util/util.js";
import { FadoutObject } from "./FadoutObject.js";

const planeGeometry = new THREE.ConeGeometry(1, 5, 30);
const planeX = 0;
const planeY = 2;
const planeZ = 35;

export class AirPlane extends FadoutObject {
  constructor(scene) {
    super(
      new THREE.Mesh(
        planeGeometry,
        new THREE.MeshLambertMaterial({ color: "red" })
      ),
      null,
      scene
    );

    this.bb = new THREE.Sphere(this.obj.position, 1);
    this.obj.rotateX(degreesToRadians(-90));
    this.obj.position.set(planeX, planeY, planeZ);

    if (scene) {
      this.addToScene(scene);
    }
  }
}
