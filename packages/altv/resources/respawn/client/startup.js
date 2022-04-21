import alt from 'alt-client';
import * as native from 'natives';
import { utils } from 'core';

let respawnCountdown;
let showRespawnCountdown = false;
let showRespawnControl = false;

alt.everyTick(() => {
  if (showRespawnCountdown) {
    utils.drawText2d('Respawn in ' + respawnCountdown + ' minute(s).', 0.5, 0.95, 0.4, 4, 255, 255, 255, 255);
  } else if (showRespawnControl) {
    utils.drawText2d('Press x to respawn.', 0.5, 0.95, 0.4, 4, 255, 255, 255, 255);
    if (native.isControlJustPressed(0, 73)) {
      showRespawnControl = false;
      alt.emitServerRaw('respawn:hospital');
    }
  }
});

alt.onServer('respawn:death', (time) => {
  respawnCountdown = time / 60000;
  showRespawnCountdown = true;

  let respawnInterval = alt.setInterval(() => {
    respawnCountdown = respawnCountdown - 1;
    if (respawnCountdown <= 0) {
      showRespawnCountdown = false;
      showRespawnControl = true;
      alt.clearInterval(respawnInterval);
    }
  }, 60000);
});
