// from https://github.com/cdaringe/coordinate-systems
import isArray from 'lodash/isArray';

var degPerRadian = 180 / Math.PI;

export var cartesianToPolar = function cartesianToPolar(xy, center, isDegree) {
  var x = void 0;
  var y = void 0;
  var r = void 0;
  var t = void 0;
  if (!isArray(xy) && xy.length !== 2) {
    throw new TypeError('expected [x, y] xy array');
  }
  x = xy[0];
  y = xy[1];
  if (center && !isArray(center) && center.length !== 2) {
    throw new TypeError('expected [x, y] center array');
  }
  if (center) {
    x = x - center[0];
    y = y - center[1];
  }
  r = Math.sqrt(x * x + y * y);
  t = Math.atan2(y, x);
  if (isDegree) {
    t = t * degPerRadian;
  }
  return [r, t];
};

export var polarToCart = function polarToCart(rt, isDegree) {
  var x = void 0;
  var y = void 0;
  var r = void 0;
  var t = void 0;
  r = rt[0];
  t = rt[1];
  if (isDegree) {
    t = t * (1 / degPerRadian);
  }
  x = r * Math.cos(t);
  y = r * Math.sin(t);
  return [x, y];
};