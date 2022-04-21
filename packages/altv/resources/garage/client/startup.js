/// <reference types="@altv/types-server" />
import alt, { WebView } from 'alt-client';
import * as native from 'natives';
import { utils } from 'core';

let webview;
let garages = [];
let garageId = '';
let vehicles = [];
let currentType = '';
let isGarageOpen = false;

const showGarage = () => {
  webview = new WebView("http://resource/client/html/index.html", false);
  webview.isVisible = true;
  webview.focus();
  alt.showCursor(true);
  alt.toggleGameControls(false);
  webview.emit('showVehicles', vehicles);

  webview.on('garage:close', () => {
    webview.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
    alt.emitRaw('snackbar:toogleShow');
    isGarageOpen = false;
  });

  webview.on('garage:spawnVehicle', (modelName) => {
    alt.emitServerRaw('garage:spawnVehicle', modelName, garageId);
  });
};

alt.onServer('garage:update', (data) => {
  garages = data;
});

alt.onServer('garage:updateData', (id, type) => {
  garageId = id;
  currentType = type;
});

alt.onServer('garage:show', (veh, id) => {
  vehicles = veh;
  garageId = id;
  showGarage();
});

alt.on('keydown', (key) => {
  if (key == '69') {
    switch (currentType) {
      case 'guard':
        if (!isGarageOpen) {
          isGarageOpen = true;
          alt.emitServerRaw('garage:showGarage', garageId);
          alt.emitRaw('snackbar:toogleShow');
        }
        break;
      case 'park':
        alt.emitServerRaw('garage:removeVehicle');
        currentType = '';
        break;
      default:
        break;
    }
  }
});

alt.everyTick(() => {
  let player = alt.Player.local;
  let isInVehicle = player.vehicle;

  garages.forEach(garage => {
    if (player.pos.distanceTo(garage.park.pos) < 50) {
      if (isInVehicle) {
        drawMarker(garage.park.pos);
      } else {
        drawMarker(garage.guard.pos);
      }
    }
  });
});

const drawMarker = (pos) => {
  utils.drawMarker(
    1, 
    new alt.Vector3(pos.x, pos.y, pos.z - 1), 
    new alt.Vector3(0, 0, 0), 
    new alt.Vector3(0, 0, 0), 
    new alt.Vector3(1.5, 1.5, 0.75), 
    0, 
    0,
    255, 
    100,
  );
}