import alt, { emitClient, Vehicle } from 'alt-server';
import { Vector3 } from 'alt-shared';
import * as chat from 'chat';

chat.registerCmd('vehicle', (player, modelName) => {
  if (!modelName) {
    chat.send(player, '/vehicle [modelName]');
    return;
  }

  spawnVehicle(player, modelName);
});

chat.registerCmd('garage', (player) => {
  emitClient(player, 'garage:show');
});

alt.onClient('garage:spawnVehicle', (player, modelName) => {
  spawnVehicle(player, modelName);
});

function spawnVehicle(player, modelName) {
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
}
