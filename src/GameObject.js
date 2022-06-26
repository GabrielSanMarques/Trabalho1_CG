export class GameObject {
  constructor(obj, boundingBox, scene) {
    this.obj = obj;
    this.bb = boundingBox;
    this.scene = null;
    this.obj.castShadow = true;

    if (scene) {
      this.addToScene(scene);
    }
  }

  addToScene(scene) {
    this.scene = scene;
    scene.add(this.obj);
  }

  removeFromScene() {
    if (this.scene) {
      this.scene.remove(this.obj);
      this.scene.remove(this.bb);
      this.scene = null;
    }
  }

  translateX(dx) {
    this.obj.translateX(dx);
  }

  translateY(dy) {
    this.obj.translateY(dy);
  }

  translateZ(dz) {
    this.obj.translateZ(dz);
  }

  collidesWith(gameObj) {
    return this.bb.intersectsSphere(gameObj.bb);
  }

  positionX() {
    return this.obj.position.x;
  }

  positionY() {
    return this.obj.position.y;
  }

  positionZ() {
    return this.obj.position.z;
  }
}
