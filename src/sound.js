import * as THREE from "three";

const trilhaSonora = new Audio("../assets/audio/megalovania.mp3");
const colisao = new Audio("../assets/audio/hit-03.mp3");
const tiroAdversario = new Audio("../assets/audio/shoot-01.mp3");
const tiroPrincipal = new Audio("../assets/audio/shoot-00.mp3");

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

export { somTrilhaSonora, somTiroAdversario, somColisao, somTiroPrincipal };
