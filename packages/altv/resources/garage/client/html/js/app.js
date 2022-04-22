let vehicles = [];

function closeGarage() {
  alt.emit('garage:close');
}

function spawnVehicle(id) {
  let vehicle = vehicles.find(v => v._id == id);
  console.log(id)
  alt.emit('garage:spawnVehicle', vehicle);
  alt.emit('garage:close');
}

alt.on('showVehicles', (veh) => {
  vehicles = veh;
  let element = document.getElementById('vehicles');

  vehicles.forEach(vehicle => {
    let newElement = document.createElement("div");
    newElement.setAttribute("class", "card");
    newElement.innerHTML = 
      "<p>Model: " + vehicle.model + "</p>" + 
      "<p>Status: " + vehicle.status + "</p>" + 
      "<div class=\"bottom\"><button class=\"button\" onclick=\"spawnVehicle('" + vehicle._id + "')\">" + "Spawn" + "</button><div>";
    element.appendChild(newElement);
  });
});

document.addEventListener('keydown', function(e) {
  if(e.key == 'e'){
    alt.emit('garage:close');
  }
});