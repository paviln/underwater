import alt from 'alt-server';
import * as chat from 'chat';

const spawn = {
    x: 278.8352,
    y: -1202.0044,
    z: 38.8843
};

alt.on('playerConnect', (player) => {
    player.model = `mp_m_freemode_01`;
    player.spawn(spawn.x, spawn.y, spawn.z, 0);
});

chat.registerCmd('position', (player) => {
    alt.log(player.pos);
});