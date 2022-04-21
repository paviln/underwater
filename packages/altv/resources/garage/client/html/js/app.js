function closeGarage() {
  alt.emit('garage:close');
}

function spawnVehicle(modelName) {
  alt.emit('garage:spawnVehicle', modelName);
  alt.emit('garage:close');
}

alt.on('showVehicles', (vehicles) => {
  console.log(vehicles)
  console.log("vehicles")
  let element = document.getElementById('vehicles');


  vehicles.forEach(vehicle => {
    let newElement = document.createElement("div");
    newElement.innerHTML = "<button class=\"button\" onclick=\"spawnVehicle('" + vehicle.model + "')\">" + vehicle.model + "</button>";
    element.appendChild(newElement);
  });

  
});
