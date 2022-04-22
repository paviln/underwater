/// <reference types="@altv/types-server" />
import alt from 'alt-server';
import * as chat from 'chat';

const spawn = {
  x: 298.8528,
  y: -584.3472,
  z: 43.2483
};

let deadPlayers = [];
const RESPAWN_TIME = 1000 * 60 * 3; // 3 minutes

alt.on('playerDeath', (player) => {
  if (deadPlayers[player.id]) {
    return;
  }

  alt.emitAllClientsRaw('respawn:death', RESPAWN_TIME);

  deadPlayers[player.id] = Date.now();
});

alt.onClient('respawn:hospital', (player) => {
  if (Date.now() - deadPlayers[player.id] >= RESPAWN_TIME) {
    respawnPlayer(player, spawn);
  }
});

// Admin revive player command
chat.registerCmd('revive', (player, option) => {
  const user = player.getMeta('user');
  const pos = player.pos;
  if (user.isAdmin) {
    switch (option) {
      case "me":
        player.setMeta('revived', true);
        alt.emitClientRaw(player, 'respawn:deathRemove');
        respawnPlayer(player, pos);
        break;
      default:
        break;
    }
  }
});

const respawnPlayer = (player, pos) => {
  // Check if the player still has an entry.
  if (deadPlayers[player.id]) {
    delete deadPlayers[player.id];
  }
  // Check if the player hasn't just left the server yet.
  if (!player || !player.valid) {
    return;
  }
  player.model = `mp_m_freemode_01`;
  player.spawn(pos.x, pos.y, pos.z, 0);
}
