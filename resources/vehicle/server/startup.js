import alt from 'alt-server';

alt.onClient('vehicle:toggleVehicleLocks', (player, vehicle) => {
  let isVehicleLocked = vehicle.lockState == 2;

  alt.emitClientRaw(player, 'vehicle:lockEffect', vehicle, isVehicleLocked);
  if (isVehicleLocked) {
    vehicle.lockState = 1;
  } else {
    vehicle.lockState = 2;
  }
});
