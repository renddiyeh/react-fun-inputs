import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as Rematrix from 'rematrix';
import pickBy from 'lodash/pickBy';
import startsWith from 'lodash/startsWith';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';

// import withResizeListener from '../hoc/withResizeListener';
import parsePercent from '../utils/parsePercent';
import Box from './Box';

function setTransform(element, transfromString) {
  if (!element) return;
  element.style.webkitTransform = transfromString;
  element.style.MozTransform = transfromString;
  element.style.msTransform = transfromString;
  element.style.OTransform = transfromString;
  element.style.transform = transfromString;
}

const avalibleTransforms = [
  'translate',
  'translateX',
  'translateY',
  'rotate',
];

const createCompnent = (...styles) => {
  const Base = (styles.length ? Box.extend(...styles) : Box);

  class Transform extends PureComponent {
    state = {}

    componentDidMount() {
      this.setConstants();
      const baseTransform = getComputedStyle(this.element).transform;
      this.matrix = Rematrix.parse(baseTransform);
      this.setTransformMatrix();
    }

    componentWillReceiveProps(nextProps) {
      this.setTransformMatrix(nextProps);
    }

    setConstants = () => {
      this.boundingBox = this.element.getBoundingClientRect();
    }

    setTransformMatrix = (props = this.props) => {
      const attrs = pickBy(props, (value, key) => avalibleTransforms.indexOf(key) > -1);
      const transforms = Object.entries(attrs).map(([key, value]) => {
        if (startsWith(key, 'translate')) return this.parseTranslate(key, value);
        return Rematrix[key](value);
      })
      const matrix = [this.matrix, ...transforms].reduce(Rematrix.multiply)
      setTransform(this.element, `matrix3d(${matrix.join(',')}`);
    }

    getCleanProps = (props = this.props) => pickBy(props, (value, key) => avalibleTransforms.indexOf(key) === -1);

    parseTranslate = (key, value) => {
      const direction = key.slice(-1);

      if (direction === 'X') return this.parseXtranslate(value);
      if (direction === 'Y') return this.parseYtranslate(value);
      let [x, y] = value.split(' ');
      if (isNil(x) || isNil(y)) [x, y] = value.split(',');
      if (!isNil(x) && !isNil(y)) return Rematrix.multiply(this.parseXtranslate(x), this.parseYtranslate(y));
      return Rematrix.rotate(0);
    }

    parseXtranslate = (v) => {
      if (isNumber(v)) return Rematrix.translateX(v);
      return Rematrix.translateX(parsePercent(v) * this.boundingBox.width);
    }

    parseYtranslate = (v) => {
      if (isNumber(v)) return Rematrix.translateY(v);
      return Rematrix.translateY(parsePercent(v) * this.boundingBox.height);
    }

    // handleResize = () => {
    //   this.setConstants();
    //   this.setTransformMatrix();
    // }

    render() {
      const { innerRef, ...props } = this.getCleanProps();
      return (
        <Base
          innerRef={(ref) => {
            if (innerRef) innerRef(ref);
            this.element = ref;
          }}
          {...props}
        />
      );
    }
  }

  Transform.propTypes = {
    innerRef: PropTypes.func,
  };

  return Transform;
}

const Comp = createCompnent();

Comp.extend = createCompnent;

export default Comp;
