import alt from 'alt-server';
import * as chat from 'chat';
import { db, connect } from './db';

let garages = [];
let colshapes = new Map();

alt.on('resourceStart', async () => {
  connect();

  garages = await db().collection('garages').find({}).toArray();

  garages.forEach(garage => {
    createColshapes(garage);
  });
});

alt.on('playerConnect', async (player) => {
  alt.emitClientRaw(player, 'garage:update', garages);
});

alt.on('entityEnterColshape', (colshape, entity) => {
  let type = colshape.getMeta('type');

  if (entity instanceof alt.Player && entity.vehicle == null) {
    if (type == 'guard') {
      entity.setMeta('type', 'guard');
      alt.emitClientRaw(entity, 'snackbar:create', type, 'info', 'Press E key  to open garage!');
      alt.emitClientRaw(entity, 'garage:updateData', colshape.getMeta('garageId'), type);
    }
  } else if (entity instanceof alt.Vehicle) {
    if (type == 'spawn') {
      colshape.setMeta('occupied', true);
    }
    else if (type == 'park') {
      alt.emitClientRaw(entity.driver, 'garage:updateData', colshape.getMeta('garageId'), type);
      alt.emitClientRaw(entity.driver, 'snackbar:create', type, 'info', 'Press E key to park vehicle!');
    }
  }
});

alt.on('entityLeaveColshape', (colshape, entity) => {
  let type = colshape.getMeta('type');

  if (entity instanceof alt.Player && entity.vehicle == null) {
    if (type == 'guard') {
      entity.setMeta('type', '');
      alt.emitClientRaw(entity, 'snackbar:remove', type);
      alt.emitClientRaw(entity, 'garage:updateData', colshape.getMeta('garageId'), '');
    }
  } else if (entity instanceof alt.Vehicle) {
    if (type == 'spawn') {
      colshape.setMeta('occupied', false);
    } else if (type == 'park') {
      alt.emitClientRaw(entity.driver, 'garage:updateData', colshape.getMeta('garageId'), '');
      alt.emitClientRaw(entity.driver, 'snackbar:remove', type);
    }
  } 
});

chat.registerCmd('vehicle', (player, modelName) => {
  if (!modelName) {
    chat.send(player, '/vehicle [modelName]');
    return;
  }

  spawnVehicle(player, modelName);
});

// Handle garage commands
chat.registerCmd('garage', (player, option) => {
  const user = player.getMeta('user');

  if (user.isAdmin) {
    switch (option) {
      case "show":
        showGarage(player);
        break;
      case "create":
        createGarage(player);
        break;
      default:
        chat.send(player, '/garage [option]');
        break;
    }
  }
});

const showGarage = (player, garageId) => {
  if (garageId === undefined) {
    spawn = {
      pos: player.pos,
      rot: player.rot,
    };
  }
  alt.emitClient(player, 'garage:show', garageId);
}

const createGarage = async (player) => {
  let guard = player.getMeta('guard');
  let spawn = player.getMeta('spawn');

  if (guard === undefined) {
    player.setMeta('guard', getCordinates(player));
  } else if (spawn === undefined) {
    player.setMeta('spawn', getCordinates(player));
  } else {
    let garage = {
      guard: player.getMeta('guard'),
      spawn: player.getMeta('spawn'),
      park: getCordinates(player),
    }
    const result = await db().collection('garages').insertOne(garage);
    garage._id = result.insertedId;
    createColshapes(garage);
    garages.push(garage);
    alt.emitClientRaw(null, 'garage:update', garages);
  }
}

const getCordinates = (player) => {
  let cordinates = {
    pos: player.pos,
    rot: player.rot,
  }

  return cordinates;
}

alt.onClient('garage:spawnVehicle', (player, modelName, garageId) => {
  const type = player.getMeta('type');
  if (type == 'guard') {
    spawnVehicle(player, modelName, garageId);
  }
});

const spawnVehicle = (player, modelName, garageId) => {
  let vehicle;
  let spawn;

  if (garageId === undefined) {
    spawn = {
      pos: player.pos,
      rot: player.rot,
    };
  } else {
    let garage = garages.find(g => (g._id == garageId));
    spawn = garage.spawn;
    let spawnCol = colshapes.get(garageId).spawnCol;
    let isBussy = spawnCol.getMeta('occupied');
    if (isBussy) return;
  }

  try {
    vehicle = new alt.Vehicle(modelName, spawn.pos, spawn.rot);
    vehicle.lockState = 2;
    vehicle.setSyncedMeta('owner', player.id);
    alt.emitClientRaw(player, 'snackbar:create', 'timer', 'success', 'Vehicle has been spawned!');
  } catch (err) {
    console.log(err)
    chat.send(player, 'Invalid vehicle model.');

    return;
  }
}

alt.onClient('garage:removeVehicle', (player) => {
  player.vehicle.destroy();
});

const createColshapes = (garage) => {
  let id = String(garage._id);
  let guard = garage.guard;
  let spawn = garage.spawn;
  let park = garage.park;

  let guardCol = new alt.ColshapeSphere(guard.pos.x, guard.pos.y, guard.pos.z, 1);
  guardCol.setMeta('type', 'guard');
  guardCol.setMeta('garageId', id);

  let spawnCol = new alt.ColshapeSphere(spawn.pos.x, spawn.pos.y, spawn.pos.z, 5);
  spawnCol.setMeta('type', 'spawn');
  spawnCol.setMeta('occupied', false);
  spawnCol.setMeta('garageId', id);

  let parkCol = new alt.ColshapeSphere(park.pos.x, park.pos.y, park.pos.z, 1);
  parkCol.setMeta('type', 'park');
  parkCol.setMeta('garageId', id);

  const data = {
    guardCol,
    spawnCol,
    parkCol,
  }

  colshapes.set(id, data);
}