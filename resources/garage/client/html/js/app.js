function closeGarage() {
  alt.emit('garage:close');
}

function spawnVehicle(modelName) {
  alt.emit('garage:spawnVehicle', modelName);
}

