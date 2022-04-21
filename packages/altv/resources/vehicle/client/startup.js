/// <reference types="@altv/types-server" />
import alt from 'alt-client';
import * as native from 'natives';

alt.on('keydown', (key) => {
  let player = alt.Player;
  let playerId = player.local.id;

  if (key == 'L'.charCodeAt(0)) {
    let vehicle = getClosestVehicle();

    if (vehicle) {
      let owner = vehicle.getSyncedMeta('owner');
      if (owner == playerId) {
        toggleVehicleLocks(vehicle);
      }
    }
  }
});

alt.onServer('vehicle:lockEffect', (vehicle, isLocked) => {
  native.startVehicleHorn(vehicle, 500, alt.hash('HELDDOWN'), false);
  vehicle.indicatorLights = 4;

  if(isLocked) {
    setTimeout(() => {
      native.startVehicleHorn(vehicle, 500, alt.hash('HELDDOWN'), false);
      vehicle.indicatorLights = 0;
    }, 1000);
  } else {
    setTimeout(() => {
      vehicle.indicatorLights = 0;
    }, 500);
  }
});

function toggleVehicleLocks(vehicle) {
  alt.emitServer('vehicle:toggleVehicleLocks', vehicle);
}

function getClosestVehicle(range = 10) {
  let closest = null;
  let lastDist = 999;
  let dist;

  for (let vehicle of alt.Vehicle.all) {
    if (vehicle.scriptID === 0) continue;
    dist = distance(alt.Player.local.pos, vehicle.pos);
    if (dist <= range && dist < lastDist) {
      lastDist = dist;
      closest = vehicle;
    }
  }

  return closest;
}

function distance(vector1, vector2) {
  return Math.sqrt(
    Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
  );
}