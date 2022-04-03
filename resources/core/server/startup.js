import alt from 'alt-server';

const spawn = {
    x: -1291.7142333984375,
    y: 83.43296813964844,
    z: 54.8916015625,
};

alt.on('playerConnect', (player) => {
    player.model = `mp_m_freemode_01`;
    player.spawn(spawn.x, spawn.y, spawn.z, 0);
    player.health = 99;
});
