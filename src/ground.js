import { createGroundPlaneWired } from "../libs/util/util.js";

const width = 150;
const height = 100;
const widthSegments = 150/2;
const heightSegments = 100/2;
const movementSpeed = -0.25;
const screenLimit = 40;

const createGround = () => {
  let ground = createGroundPlaneWired(width, height, widthSegments, heightSegments);

  return ground;
};

const moveGround = (ground) => {
  ground.translateY(movementSpeed);
  console.log(ground.position.z);
  if(ground.position.z >= screenLimit) ground.position.set(0, 0, 0);
}

export { createGround, moveGround };

