import * as THREE from "three";
import { CSG } from "../libs/other/CSGMesh.js";

const updateObject = (mesh) => {
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
};

export const createRechargeObject = () => {
  const auxMat = new THREE.Matrix4();
  const parallelepiped = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1));
  const cylinderMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.5, 20)
  );

  cylinderMesh.position.set(0, 0, 0);
  parallelepiped.position.set(0, 0, 0);

  const cylinderCSG = CSG.fromMesh(cylinderMesh);
  const parallelepipedCSG = CSG.fromMesh(parallelepiped);

  let rechargerCSG = cylinderCSG.subtract(parallelepipedCSG);
  let rechargerMesh = CSG.toMesh(rechargerCSG, auxMat);

  rechargerMesh.rotateX(Math.PI / 2);
  rechargerMesh.rotateY(Math.PI / 2);

  updateObject(rechargerMesh);

  rechargerCSG = CSG.fromMesh(rechargerMesh);
  rechargerCSG = rechargerCSG.subtract(parallelepipedCSG);

  rechargerMesh = CSG.toMesh(rechargerCSG, auxMat);
  rechargerMesh.material = new THREE.MeshPhongMaterial({ color: "red" });

  return rechargerMesh;
};
