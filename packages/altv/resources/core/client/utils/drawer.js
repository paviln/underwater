import * as native from 'natives';

export function drawText2d(
  msg,
  x,
  y,
  scale,
  fontType,
  r,
  g,
  b,
  a,
  useOutline = true,
  useDropShadow = true,
  layer = 0,
  align = 0
) {
  let hex = msg.match('{.*}');
  if (hex) {
    const rgb = hexToRgb(hex[0].replace('{', '').replace('}', ''));
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    msg = msg.replace(hex[0], '');
  }

  native.beginTextCommandDisplayText('STRING');
  native.addTextComponentSubstringPlayerName(msg);
  native.setTextFont(fontType);
  native.setTextScale(1, scale);
  native.setTextWrap(0.0, 1.0);
  native.setTextCentre(true);
  native.setTextColour(r, g, b, a);
  native.setTextJustification(align);

  if (useOutline) {
    native.setTextOutline();
  }

  if (useDropShadow) {
    native.setTextDropShadow();
  }

  native.endTextCommandDisplayText(x, y, 0);
}

/**
 * Draw a marker. Requires alt.everyTick or alt.setInterval
 *
 * @param  {number} type
 * @param  {alt.Vector3} pos
 * @param  {alt.Vector3} dir
 * @param  {alt.Vector3} rot
 * @param  {alt.Vector3} scale
 * @param  {number} r
 * @param  {number} g
 * @param  {number} b
 * @param  {number} alpha
 */
export function drawMarker(type, pos, dir, rot, scale, r, g, b, alpha) {
  native.drawMarker(
      type,
      pos.x,
      pos.y,
      pos.z,
      dir.x,
      dir.y,
      dir.z,
      rot.x,
      rot.y,
      rot.z,
      scale.x,
      scale.y,
      scale.z,
      r,
      g,
      b,
      alpha,
      false,
      true,
      2,
      false,
      undefined,
      undefined,
      false
  );
}
