import alt from 'alt-server';

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
    // Check if the player still has an entry.
    if (deadPlayers[player.id]) {
      delete deadPlayers[player.id];
    }
    // Check if the player hasn't just left the server yet.
    if (!player || !player.valid) {
      return;
    }
    player.model = `mp_m_freemode_01`;
    player.spawn(spawn.x, spawn.y, spawn.z, 0);
  }
});
