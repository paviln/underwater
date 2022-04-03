import alt, { onServer, WebView } from 'alt-client';
import * as native from 'natives';

let webview;

onServer('garage:show', () => {
  webview = new WebView("http://resource/client/html/index.html");
  webview.isVisible = true;
  webview.focus();
  alt.showCursor(true);
  alt.toggleGameControls(false);

  webview.on('garage:close', () => {
    webview.destroy();
    alt.showCursor(false);
    alt.toggleGameControls(true);
  });

  webview.on('garage:spawnVehicle', (modelName) => {
    alt.emitServerRaw('garage:spawnVehicle', modelName);
  });
});
