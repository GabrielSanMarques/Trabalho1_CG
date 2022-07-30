import { ROOT_PATH } from "/Trabalho1_CG/constants.js";

const trilhaSonora = new Audio(`${ROOT_PATH}/assets/audio/megalovania.mp3`);
const colisao = new Audio(`${ROOT_PATH}/assets/audio/hit-03.mp3`);
const tiroAdversario = new Audio(`${ROOT_PATH}/assets/audio/shoot-01.mp3`);
const tiroPrincipal = new Audio(`${ROOT_PATH}/assets/audio/shoot-00.mp3`);
const trombone = new Audio(`${ROOT_PATH}/assets/audio/fortnite.mp3`);

const somTrilhaSonora = () => {
  trilhaSonora.load();
  trilhaSonora.play();
};

const somTiroAdversario = () => {
  tiroAdversario.load();
  tiroAdversario.play();
};

const somTiroPrincipal = () => {
  tiroPrincipal.load();
  tiroPrincipal.play();
};

const somColisao = () => {
  colisao.load();
  colisao.play();
};

const somRestart = () => {
  trombone.load();
  trombone.play();
};
export {
  somTrilhaSonora,
  somTiroAdversario,
  somColisao,
  somTiroPrincipal,
  somRestart,
};
