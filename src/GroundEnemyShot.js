import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { loadGLTFFile } from "./gltf.js";

const ballGeometry = new THREE.SphereGeometry(0.6, 20, 20);
const ballMaterial = new THREE.MeshLambertMaterial({ color: "pink" });
const speed = 0.7;
const speedY = 0.2;

let _modelObj = null;

export const shotImageIsLoaded = () => _modelObj != null;

export const getObject = async () => {
  await loadShotImage();
  return _modelObj.clone();
};

export const loadShotImage = async () => {
  if (_modelObj == null) {
    _modelObj = await loadGLTFFile("/assets/objects/", "missile", 4.0, true);
  }
};

export const createGroundEnemyShot = async(enemy, scene, plane) => {
  const object = await getObject();
  const shot = new GameObject(object, null, scene);

  const x = enemy.positionX();
  const y = enemy.positionY();
  const z = enemy.positionZ() + 3;

  shot.direction = new THREE.Vector3(x - plane.positionX(), y, z - plane.positionZ());
  shot.direction.normalize();
  shot.plane = plane;

  shot.bb = new THREE.Sphere(shot.obj.position, 0.6);
  shot.obj.position.set(x, y, z);

  return Object.assign(shot, { 
    move: () => {
      if(shot.positionY() < shot.plane.positionY())
      {
          shot.obj.translateY(speedY);
      }
      else
      {
          shot.obj.translateZ(shot.direction.z * -speed);
          shot.obj.translateX(shot.direction.x * -speed);
      }
     }
   })

/*
  return { ...shot, 
    move: () => {
    if(shot.positionY() < shot.plane.positionY())
    {
        shot.obj.translateY(speedY);
    }
    else
    {
        shot.obj.translateZ(shot.direction.z * -speed);
        shot.obj.translateX(shot.direction.x * -speed);
    }
   },
   positionX: () => {
      return shot.positionX();
   },
   positionZ: () => {
    return shot.positionY();
   },
   removeFromScene: () => {
      shot.removeFromScene();
   },
   collidesWith(gameObj) {
      return shot.collidesWith(gameObj);
  }
}
*/
/*
export class GroundEnemyShot extends GameObject {
  constructor(enemy, scene, plane) {
    
  }

  
  }
*/

}
