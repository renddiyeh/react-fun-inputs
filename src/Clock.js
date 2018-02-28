import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import round from 'lodash/round';
import clamp from 'lodash/clamp';

import DragToRotate from './utils/DragToRotate';

import withResizeListener from './hoc/withResizeListener';
import Border from './components/Border';
import Box from './components/Box';
import Input from './components/Input';
import Transform from './components/Transform';

const getAngle = (value, hours) => {
  const base = hours ? 12 * 60 : 60;
  return ((value % base) / base) * 360;
};

const Tick = Transform.extend`
  position: absolute;
  top: 55%;
  left: 50%;
  background-color: currentColor;
  transform-origin: 50% 90%;
  ${({ draggable }) => draggable && 'cursor: pointer;'}
`;

const angleToValue = (angle) => (angle / 360) * 60;

class Clock extends Component {
  constructor(props) {
    super(props);
    this.setContants();
    const value = this.clamp(props.value * this.unit);
    this.state = {
      value,
      displayValue: value / this.unit,
    };
  }

  componentDidMount() {
    this.dragging = new DragToRotate(this.getOrigin());
    this.hammertime = new Hammer(this.tick);
    this.hammertime.on('panmove', this.handleDrag);
    this.hammertime.on('panend', this.handleDragEnd);
  }

  setContants = (props = this.props) => {
    const {
      precision,
      min,
      max,
      hours,
    } = props;
    this.threshold = 30;
    this.unit = hours ? 60 : 1;
    this.format = (v) => round(v, precision);
    this.clamp = (v) => clamp(v, min * this.unit, max * this.unit);
  }

  setValue = (v) => {
    const value = this.clamp(v);
    const displayValue = this.format(value / this.unit);
    this.setState({ value, displayValue });
  }

  getOrigin = () => {
    const {
      left,
      top,
      right,
      bottom,
    } = this.container.getBoundingClientRect();
    return [(left + right) / 2, (top + bottom) / 2];
  }

  handleDrag = ({ center: { x, y } }) => {
    const { value } = this.state;
    const delta = this.dragging.parseDrag([x, y]);
    const offset = this.format(angleToValue(delta));
    if (Math.abs(offset) < this.threshold) {
      this.setValue(value + (offset * this.unit));
    }
  }

  handleDragEnd = () => {
    const { onChange } = this.props;
    if (onChange) onChange(this.state.displayValue);
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      value: value * this.unit,
      displayValue: value,
    });
  }

  render() {
    const {
      onChange,
      min,
      max,
      hours,
      showArea,
      border,
      borderWidth,
      borderColor,
      precision,
      ...props
    } = this.props;
    const { value, displayValue } = this.state;
    return (
      <Box align="center" {...props}>
        <div ref={(ref) => { this.container = ref; }}>
          <Border
            bg="white"
            color="black"
            border={border}
            borderWidth={borderWidth}
            borderColor={borderColor}
            borderRadius="50%"
            pb="100%"
            position="relative"
          >
            <Tick
              w="0.75em"
              height="33%"
              draggable={hours}
              zIndex={+hours}
              innerRef={(ref) => { if (hours) this.tick = ref; }}
              translateX="-50%"
              translateY="-90%"
              rotate={getAngle(value, true)}
            />
            <Tick
              w="0.5em"
              height="45%"
              draggable={!hours}
              zIndex={+!hours}
              innerRef={(ref) => { if (!hours) this.tick = ref; }}
              translateX="-50%"
              translateY="-90%"
              rotate={getAngle(value)}
            />
          </Border>
        </div>
        <Input
          type="number"
          value={this.props.value || displayValue}
          onChange={this.handleInputChange}
          min={min}
          max={max}
        />
      </Box>
    );
  }
}

Clock.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  hours: PropTypes.bool,
  showArea: PropTypes.bool,
  precision: PropTypes.number,
  border: PropTypes.string,
  borderWidth: PropTypes.string,
  borderColor: PropTypes.string,
};

Clock.defaultProps = {
  value: 0,
  border: '2px solid black',
  precision: 0,
  min: 0,
  max: Infinity,
};

export default withResizeListener(Clock);
