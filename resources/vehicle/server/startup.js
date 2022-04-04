import alt from 'alt-server';

alt.onClient('vehicle:toggleVehicleLocks', (player, vehicle) => {
  if (vehicle.lockState == 1) {
    vehicle.lockState = 2
  } else {
    vehicle.lockState = 1
  }
});
