import alt from 'alt-client';
import * as native from 'natives';

let webview;

alt.onServer('snackbar:show', () => {
  webview = new alt.WebView("http://resource/client/web/index.html", false);
});

alt.onServer('snackbar:hide', () => {
  if (webview) {
    webview.destroy();
  }
});

alt.onServer('snackbar:create', (id, variant, text) => {
  if (!webview) {
    webview = new alt.WebView("http://resource/client/web/index.html", false);
  }

  webview.emit('createSnackbar', id, variant, text);
});

alt.on('snackbar:toogleShow', () => {
  if (webview) {
    webview.isVisible = !webview.isVisible;
  }
});

alt.onServer('snackbar:remove', (id) => {
  webview.emit('removeSnackbar', id);
});

alt.on('snackbar:remove', (id) => {
  webview.emit('removeSnackbar', id);
});

