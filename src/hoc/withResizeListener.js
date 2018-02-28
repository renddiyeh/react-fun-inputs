import { PureComponent, createElement } from 'react';
import { subscribe } from 'subscribe-ui-event';

Object.assign = require('object-assign');

export default (Comp) => {
  class Resizable extends PureComponent {
    componentDidMount() {
      this.subscription = subscribe('resize', this.onResize);
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    onResize = (event) => {
      const instance = this.getInstance();

      if (typeof instance.handleResize === 'function') {
        instance.handleResize(event);
      }
    }

    getInstance() {
      if (!Comp.prototype.isReactComponent) {
        return this;
      }
      const ref = this.instanceRef;
      return ref.getInstance ? ref.getInstance() : ref;
    }

    getRef = (ref) => { this.instanceRef = ref; }

    render() {
      const { ...props } = this.props;
      if (Comp.prototype.isReactComponent) {
        Object.assign(props, { ref: this.getRef });
      } else {
        Object.assign(props, { innerRef: this.getRef });
      }

      return createElement(Comp, props);
    }
  }

  return Resizable;
};
