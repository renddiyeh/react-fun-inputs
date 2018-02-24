var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var avalibleTransforms = ['translate', 'translateX', 'translateY', 'rotate'];

var createCompnent = function createCompnent() {
  var Base = arguments.length ? Box.extend.apply(Box, arguments) : Box;

  var Transform = function (_PureComponent) {
    _inherits(Transform, _PureComponent);

    function Transform() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Transform);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Transform.__proto__ || Object.getPrototypeOf(Transform)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.setConstants = function () {
        _this.boundingBox = _this.element.getBoundingClientRect();
      }, _this.setTransformMatrix = function () {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;

        var attrs = pickBy(props, function (value, key) {
          return avalibleTransforms.indexOf(key) > -1;
        });
        var transforms = Object.entries(attrs).map(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              key = _ref3[0],
              value = _ref3[1];

          if (startsWith(key, 'translate')) return _this.parseTranslate(key, value);
          return Rematrix[key](value);
        });
        var matrix = [_this.matrix].concat(_toConsumableArray(transforms)).reduce(Rematrix.multiply);
        setTransform(_this.element, 'matrix3d(' + matrix.join(','));
      }, _this.getCleanProps = function () {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;
        return pickBy(props, function (value, key) {
          return avalibleTransforms.indexOf(key) === -1;
        });
      }, _this.parseTranslate = function (key, value) {
        var direction = key.slice(-1);

        if (direction === 'X') return _this.parseXtranslate(value);
        if (direction === 'Y') return _this.parseYtranslate(value);

        var _value$split = value.split(' '),
            _value$split2 = _slicedToArray(_value$split, 2),
            x = _value$split2[0],
            y = _value$split2[1];

        if (isNil(x) || isNil(y)) {
          ;

          var _value$split3 = value.split(',');

          var _value$split4 = _slicedToArray(_value$split3, 2);

          x = _value$split4[0];
          y = _value$split4[1];
        }if (!isNil(x) && !isNil(y)) return Rematrix.multiply(_this.parseXtranslate(x), _this.parseYtranslate(y));
        return Rematrix.rotate(0);
      }, _this.parseXtranslate = function (v) {
        if (isNumber(v)) return Rematrix.translateX(v);
        return Rematrix.translateX(parsePercent(v) * _this.boundingBox.width);
      }, _this.parseYtranslate = function (v) {
        if (isNumber(v)) return Rematrix.translateY(v);
        return Rematrix.translateY(parsePercent(v) * _this.boundingBox.height);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Transform, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.setConstants();
        var baseTransform = getComputedStyle(this.element).transform;
        this.matrix = Rematrix.parse(baseTransform);
        this.setTransformMatrix();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.setTransformMatrix(nextProps);
      }
    }, {
      key: 'render',


      // handleResize = () => {
      //   this.setConstants();
      //   this.setTransformMatrix();
      // }

      value: function render() {
        var _this2 = this;

        var _getCleanProps = this.getCleanProps(),
            _innerRef = _getCleanProps.innerRef,
            props = _objectWithoutProperties(_getCleanProps, ['innerRef']);

        return React.createElement(Base, Object.assign({
          innerRef: function innerRef(ref) {
            if (_innerRef) _innerRef(ref);
            _this2.element = ref;
          }
        }, props));
      }
    }]);

    return Transform;
  }(PureComponent);

  Transform.propTypes = {
    innerRef: PropTypes.func
  };

  return Transform;
};

var Comp = createCompnent();

Comp.extend = createCompnent;

export default Comp;