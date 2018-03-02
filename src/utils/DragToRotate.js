import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';

const degPerRadian = 180 / Math.PI;
const getRotate = (xy, center) => {
  let x;
  let y;
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
  return Math.atan2(y, x) + (Math.PI / 2);
};

const radianToDegree = (r) => r * degPerRadian;
const degreenToRadian = (d) => d / degPerRadian;
const angleToValue = (angle) => angle / Math.PI / 2;

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
    const startAngle = this.pointToAngle(point);
    this.lastAngle = startAngle;
    this.lastValue = angleToValue(startAngle);
  }

  setCenter = (point) => {
    this.center = point;
  }

  pointToAngle = (point) => getRotate(point, this.center)

  parseDrag = (point) => {
    const angle = this.pointToAngle(point);
    if (!isNumber(this.lastAngle)) {
      this.lastAngle = angle;
      this.lastValue = angleToValue(angle);
      return 0;
    }
    let delta = angle - this.lastAngle;

    if (delta < 0) {
      delta += Math.PI * 2;
    }
    if (delta > Math.PI) {
      delta -= Math.PI * 2;
    }
    const deltaValue = angleToValue(delta);
    this.lastValue += deltaValue;
    this.lastAngle = angle;
    return deltaValue;
  }

  clear = () => {
    this.lastAngle = null;
  }
}
