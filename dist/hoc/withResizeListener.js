var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PureComponent, createElement } from 'react';
import { subscribe } from 'subscribe-ui-event';

Object.assign = require('object-assign');

export default (function (Comp) {
  var Resizable = function (_PureComponent) {
    _inherits(Resizable, _PureComponent);

    function Resizable() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Resizable);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Resizable.__proto__ || Object.getPrototypeOf(Resizable)).call.apply(_ref, [this].concat(args))), _this), _this.getRef = function (ref) {
        return _this.instanceRef = ref;
      }, _this.onResize = function (event) {
        var instance = _this.getInstance();

        if (typeof instance.handleResize === 'function') {
          instance.handleResize(event);
          return;
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Resizable, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.subscription = subscribe('resize', this.onResize);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.subscription.unsubscribe();
      }
    }, {
      key: 'getInstance',
      value: function getInstance() {
        if (!Comp.prototype.isReactComponent) {
          return this;
        }
        var ref = this.instanceRef;
        return ref.getInstance ? ref.getInstance() : ref;
      }
    }, {
      key: 'render',
      value: function render() {
        var props = _objectWithoutProperties(this.props, []);

        if (Comp.prototype.isReactComponent) {
          Object.assign(props, { ref: this.getRef });
        } else {
          Object.assign(props, { innerRef: this.getRef });
        }

        return createElement(Comp, props);
      }
    }]);

    return Resizable;
  }(PureComponent);

  return Resizable;
});