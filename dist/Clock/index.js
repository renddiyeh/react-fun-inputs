var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  top: 55%;\n  left: 50%;\n  background-color: currentColor;\n  transform-origin: 50% 90%;\n  ', '\n'], ['\n  position: absolute;\n  top: 55%;\n  left: 50%;\n  background-color: currentColor;\n  transform-origin: 50% 90%;\n  ', '\n']);

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import round from 'lodash/round';
import clamp from 'lodash/clamp';

import { cartesianToPolar } from '../utils/coordinates';

import withResizeListener from '../hoc/withResizeListener';
import Border from '../components/Border';
import Box from '../components/Box';
import Input from '../components/Input';
import Transform from '../components/Transform';

var getAngle = function getAngle(value, hours) {
  var base = hours ? 12 * 60 : 60;
  return value % base / base * 360;
};

var Tick = Transform.extend(_templateObject, function (_ref) {
  var draggable = _ref.draggable;
  return draggable && 'cursor: pointer;';
});

var normalizAngle = function normalizAngle(a) {
  return a < 0 ? a + 360 : a;
};
var valueToAngle = function valueToAngle(value) {
  return value % 60 / 60 * 360 - 90;
};
var angleToValue = function angleToValue(angle) {
  return angle / 360 * 60;
};

var Clock = function (_PureComponent) {
  _inherits(Clock, _PureComponent);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

    _initialiseProps.call(_this);

    _this.setContants();
    var value = _this.clamp(props.value * _this.unit);
    _this.state = {
      value: value,
      displayValue: value / _this.unit
    };
    return _this;
  }

  _createClass(Clock, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.hammertime = new Hammer(this.tick);
      this.hammertime.on('panmove', this.handleDrag);
      this.hammertime.on('panend', this.handleDragEnd);
      this.setOrigin();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          onChange = _props.onChange,
          min = _props.min,
          max = _props.max,
          hours = _props.hours,
          showArea = _props.showArea,
          border = _props.border,
          borderWidth = _props.borderWidth,
          borderColor = _props.borderColor,
          precision = _props.precision,
          props = _objectWithoutProperties(_props, ['onChange', 'min', 'max', 'hours', 'showArea', 'border', 'borderWidth', 'borderColor', 'precision']);

      var _state = this.state,
          value = _state.value,
          displayValue = _state.displayValue;

      return React.createElement(
        Box,
        Object.assign({ align: 'center' }, props),
        React.createElement(
          'div',
          { ref: function ref(_ref2) {
              _this2.container = _ref2;
            } },
          React.createElement(
            Border,
            {
              bg: 'white',
              color: 'black',
              border: border,
              borderWidth: borderWidth,
              borderColor: borderColor,
              borderRadius: '50%',
              pb: '100%',
              position: 'relative'
            },
            React.createElement(Tick, {
              w: '0.75em',
              height: '33%',
              draggable: hours,
              zIndex: +hours,
              innerRef: function innerRef(ref) {
                hours && (_this2.tick = ref);
              },
              translateX: '-50%',
              translateY: '-90%',
              rotate: getAngle(value, true)
            }),
            React.createElement(Tick, {
              w: '0.5em',
              height: '45%',
              draggable: !hours,
              zIndex: +!hours,
              innerRef: function innerRef(ref) {
                !hours && (_this2.tick = ref);
              },
              translateX: '-50%',
              translateY: '-90%',
              rotate: getAngle(value)
            })
          )
        ),
        React.createElement(Input, {
          type: 'number',
          value: this.props.value || displayValue,
          onChange: this.handleInputChange,
          min: min,
          max: max
        })
      );
    }
  }]);

  return Clock;
}(PureComponent);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.setContants = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this3.props;
    var precision = props.precision,
        min = props.min,
        max = props.max,
        hours = props.hours;

    _this3.threshold = 30;
    _this3.unit = hours ? 60 : 1;
    _this3.format = function (v) {
      return round(v, precision);
    };
    _this3.clamp = function (v) {
      return clamp(v, min * _this3.unit, max * _this3.unit);
    };
  };

  this.setValue = function (v) {
    var value = _this3.clamp(v);
    var displayValue = _this3.format(value / _this3.unit);
    _this3.setState({ value: value, displayValue: displayValue });
  };

  this.setOrigin = function () {
    var _container$getBoundin = _this3.container.getBoundingClientRect(),
        left = _container$getBoundin.left,
        top = _container$getBoundin.top,
        right = _container$getBoundin.right,
        bottom = _container$getBoundin.bottom;

    _this3.origin = [(left + right) / 2, (top + bottom) / 2];
  };

  this.handleResize = function () {
    _this3.setOrigin();
  };

  this.handleDrag = function (_ref3) {
    var _ref3$center = _ref3.center,
        x = _ref3$center.x,
        y = _ref3$center.y;
    var value = _this3.state.value;

    var polar = cartesianToPolar([x, y], _this3.origin, true);
    var targetTheta = normalizAngle(polar[1]);
    var curentTheta = normalizAngle(valueToAngle(value / _this3.unit));
    var delta = targetTheta - curentTheta;

    var absDelta = Math.abs(delta);
    if (absDelta > 300) {
      if (delta < 0) {
        delta = delta + 360;
      } else {
        delta = delta - 360;
      }
    }
    var offset = _this3.format(angleToValue(delta));
    if (Math.abs(offset) < _this3.threshold) {
      _this3.setValue(value + offset * _this3.unit);
    }
  };

  this.handleDragEnd = function () {
    var onChange = _this3.props.onChange;

    if (onChange) onChange(_this3.state.displayValue);
  };

  this.handleInputChange = function (e) {
    var value = e.target.value;

    _this3.setState({
      value: value * _this3.unit,
      displayValue: value
    });
  };
};

Clock.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  hours: PropTypes.bool,
  showArea: PropTypes.bool,
  precision: PropTypes.number
};

Clock.defaultProps = {
  value: 0,
  border: '2px solid black',
  precision: 0,
  min: 0,
  max: Infinity
};

export default withResizeListener(Clock);