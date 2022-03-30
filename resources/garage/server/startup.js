/// <reference types="@altv/types-server" />
import { Vehicle } from 'alt-server';
/// <reference types="@altv/alt-shared" />
import { Vector3 } from 'alt-shared';
import * as chat from 'chat';

chat.registerCmd('vehicle', (player, modelName) => {
    if (!modelName) {
        chat.send(player, '/vehicle [modelName]');
        return;
    }

    let playerPos = player.pos;
    let spawnPos = new Vector3(playerPos.x + 5, playerPos.y, playerPos.z);
    let spawnRot = new Vector3(0, 0, 0);

    let vehicle;
    try {
        vehicle = new Vehicle(modelName, spawnPos, spawnRot);;
    } catch (err) {
        console.log(err)
        chat.send(player, 'Invalid vehicle model.');

        return;
    }
});