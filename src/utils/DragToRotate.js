import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';

const degPerRadian = 180 / Math.PI;
const cartesianToPolar = (xy, center, isDegree) => {
  let x;
  let y;
  let t;
  if (!isArray(xy) && xy.length !== 2) {
    throw new TypeError('expected [x, y] xy array');
  }
  [x, y] = xy;
  if (center && !isArray(center) && center.length !== 2) {
    throw new TypeError('expected [x, y] center array');
  }
  if (center) {
    x -= center[0];
    y -= center[1];
  }
  const r = Math.sqrt((x * x) + (y * y));
  t = Math.atan2(y, x);
  if (isDegree) t *= degPerRadian;
  return [r, t];
};

const normalizAngle = (a) => (a < 0 ? a + 360 : a);
const radianToDegree = (r) => r * degPerRadian;
const degreenToRadian = (d) => d / degPerRadian;

export {
  radianToDegree,
  degreenToRadian,
};

export default class DragToRotate {
  static radianToDegree = radianToDegree

  static degreenToRadian = degreenToRadian

  constructor(center) {
    this.center = center;
  }

  setDragStart = (point) => {
    this.startAngle = this.pointToAngle(point);
  }

  setCenter = (point) => {
    this.center = point;
  }

  pointToAngle = (point) => normalizAngle(cartesianToPolar(point, this.center, true)[1])

  parseDrag = (point) => {
    const angle = this.pointToAngle(point);
    if (!isNumber(this.startAngle)) {
      this.startAngle = angle;
      return 0;
    }
    let delta = angle - this.startAngle;
    this.startAngle = angle;
    const absDelta = Math.abs(delta);
    if (absDelta > 300) {
      if (delta < 0) {
        delta += 360;
      } else {
        delta -= 360;
      }
    }
    return delta;
  }

  clear = () => {
    this.startAngle = null;
  }
}
