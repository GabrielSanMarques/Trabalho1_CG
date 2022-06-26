import Stats from "../build/jsm/libs/stats.module.js"; //

export const createFpsStatsPanel = () => {
  const stats = new Stats();

  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  return stats;
};
