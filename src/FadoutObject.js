import { GameObject } from "./GameObject.js";

function fadeOutEffect(objet, scene) {
  const fadeEffect = setInterval(() => {
    if (objet.material.opacity > 0) {
      objet.material.opacity -= 0.2;
    } else {
      clearInterval(fadeEffect);
      scene.remove(objet);
    }
  }, 100);
}

export class FadoutObject extends GameObject {
  constructor(obj, bb, scene) {
    super(obj, bb, scene);
    this.obj.material.transparent = true;
  }

  fadoutFromScene() {
    if (this.scene) {
      this.scene.remove(this.bb);
      fadeOutEffect(this.obj, this.scene);
      this.obj.castShadow = false;
      this.scene = null;
    }
  }
}
