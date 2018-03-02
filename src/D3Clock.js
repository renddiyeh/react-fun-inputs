import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { range } from 'd3-array';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import clamp from 'lodash/clamp';

import Box from './components/Box';
import Input from './components/Input';
import DragToRotate from './utils/DragToRotate';

const StyledDiv = styled.div`
.draggable{
  cursor: pointer;
}
`;

const radians = 0.0174532925;
class D3Clock extends Component {
  constructor(props) {
    super(props);
    this.hourScale = scaleLinear()
      .range([0, 330])
      .domain([0, 11]);

    this.minuteScale = scaleLinear()
      .range([0, 354])
      .domain([0, 59]);

    this.state = {
      displayValue: props.value,
    };

    this.setConstants();
  }

  componentDidMount() {
    this.drawClock();
  }

  getCurrentTime = (value) => {
    const { hours } = this.props;
    let mins = value;
    if (hours) {
      mins = value * 60;
    }
    return [mins / 60, mins % 60];
  }

  setConstants = (props = this.props) => {
    this.clockRadius = props.clockRadius;
    this.clockPadding = props.clockPadding;
    this.minuteHandBalance = props.minuteHandBalance;
    this.minuteTickLength = -props.minuteTickLength;
    this.hourTickLength = -props.hourTickLength;
    this.minuteLabelYOffset = props.minuteLabelYOffset;
    this.hourLabelYOffset = props.hourLabelYOffset;
    this.width = (this.clockRadius + this.clockPadding) * 2;
    this.height = (this.clockRadius + this.clockPadding) * 2;
    this.center = [this.width / 2, this.height / 2];
    this.hourHandLength = (2 * this.clockRadius) / 3;
    this.minuteHandLength = this.clockRadius;
    this.minuteHandLength = this.clockRadius - 12;
    this.minuteTickStart = this.clockRadius;
    this.hourTickStart = this.clockRadius;
    this.minuteLabelRadius = this.clockRadius + 16;
    this.hourLabelRadius = this.clockRadius - 40;
    const [hour, minute] = this.getCurrentTime(this.state.displayValue);
    this.handData = [
      {
        type: 'hour',
        value: hour,
        length: -this.hourHandLength,
        scale: this.hourScale,
        strokeWidth: 8,
        tick: {
          range: [0, 12],
          gap: 1,
        },
        label: {
          range: [3, 13],
          gap: 3,
        },
      },
      {
        type: 'minute',
        value: minute,
        length: -this.minuteHandLength,
        scale: this.minuteScale,
        strokeWidth: 5,
        tick: {
          range: [0, 60],
          gap: 1,
        },
        label: {
          range: [5, 61],
          gap: 5,
        },
      },
    ];

    this.dragging = new DragToRotate(this.center);
  }

  updateClock = (value) => {
    const [hour, minute] = this.getCurrentTime(value);
    this.handData[0].value = hour;
    this.handData[1].value = minute;
    this.hands
      .data(this.handData)
      .attr('transform', (d) => `rotate(${d.scale(d.value)})`);
  }

  updateValue = (value) => {
    const { onChange, min, max } = this.props;
    const displayValue = clamp(value, min, max);
    if (onChange) onChange(displayValue);
    this.setState({
      displayValue,
    });
    this.updateClock(displayValue);
  }

  angleToValue = (angle) => Math.round(angle / 6)

  canDrag = ({ type }) => {
    if (this.props.hours) {
      if (type !== 'hour') return false;
    }
    if (type !== 'minute') return false;
    return true;
  }

  drawClock = () => {
    const {
      width,
      height,
      clockRadius,
      clockPadding,
    } = this;
    const {
      showHourLabel,
      showMinuteLabel,
      showHourTick,
      showMinuteTick,
      clockBg,
    } = this.props;
    const svg = select(this.container).append('svg')
      .attr('width', width)
      .attr('height', height);
    this.face = svg.append('g')
      .attr('id', 'clock-face')
      .attr('transform', `translate(${clockRadius + clockPadding},${clockRadius + clockPadding})`);
    this.face.append('g').attr('id', 'face-base')
      .append('circle')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', clockBg)
      .attr('stroke', 'currentColor')
      .attr('r', clockRadius);
    // add marks for minutes
    if (showMinuteTick) this.drawTick('minute', showMinuteLabel);
    if (showHourTick) this.drawTick('hour', showHourLabel);

    this.face.append('g').attr('id', 'face-overlay')
      .append('circle').attr('class', 'hands-cover')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'currentColor')
      .attr('r', clockRadius / 20);

    const handsGroup = this.face.append('g').attr('id', 'clock-hands');
    handsGroup.selectAll('line')
      .data(this.handData)
      .enter()
      .append('line')
      .attr('class', (d) => `${d.type}-hand ${this.canDrag(d) ? 'draggable' : ''}`)
      .attr('x1', 0)
      .attr('y1', (d) => (d.balance ? d.balance : 0))
      .attr('x2', 0)
      .attr('y2', (d) => d.length)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', (d) => d.strokeWidth)
      .attr('transform', (d) => `rotate(${d.scale(d.value)})`)
      .call(drag().container(this.container)
        .filter(this.canDrag)
        .on('end', this.handleDragEnd)
        .on('drag', this.handleDrag));
    this.hands = select('#clock-hands').selectAll('line');
  }

  drawTick = (type, showLabel) => {
    if (!type) return;
    const { tick, label } = this.handData.find((d) => d.type === type);
    const tickName = `${type}-tick`;
    const tickStart = this[`${type}TickStart`];
    const tickLength = this[`${type}TickLength`];
    const tickScale = this[`${type}Scale`];
    const labelRadius = this[`${type}LabelRadius`];
    const labelYOffset = this[`${type}LabelYOffset`];

    this.face.selectAll(`.${tickName}`)
      .data(range(...tick.range.concat(tick.gap))).enter()
      .append('line')
      .attr('class', tickName)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', tickStart)
      .attr('y2', tickStart + tickLength)
      .attr('stroke', 'currentColor')
      .attr('transform', (d) => `rotate(${tickScale(d)})`);
    if (showLabel) {
      const labelName = `${type}-label`;
      this.face.selectAll(`.${labelName}`)
        .data(range(...(label.range.concat(label.gap)))).enter()
        .append('text')
        .attr('class', labelName)
        .attr('text-anchor', 'middle')
        .attr('x', (d) => labelRadius * Math.sin(tickScale(d) * radians))
        .attr('y', (d) => -(labelRadius * Math.cos(tickScale(d) * radians)) + labelYOffset)
        .attr('fill', 'currentColor')
        .text((d) => d);
    }
  }

  handleDrag = () => {
    const { x, y } = event;
    const delta = this.dragging.parseDrag([x, y]);
    this.updateValue(this.state.displayValue + (delta * 60));
  }

  handleInputChange = (e) => {
    this.updateValue(+e.target.value);
  }

  render() {
    const {
      onChange,
      min,
      max,
      hours,
      clockRadius,
      clockPadding,
      minuteHandBalance,
      minuteTickLength,
      hourTickLength,
      minuteLabelYOffset,
      hourLabelYOffset,
      showHourLabel,
      showMinuteLabel,
      showHourTick,
      showMinuteTick,
      clockBg,
      value,
      ...props
    } = this.props;
    const { displayValue } = this.state;
    return (
      <Box align="center" {...props} width={(clockRadius + clockPadding) * 2}>
        <StyledDiv innerRef={(ref) => { this.container = ref; }} />
        <Input
          type="number"
          value={displayValue}
          onChange={this.handleInputChange}
          min={min}
          max={max}
        />
      </Box>
    );
  }
}

D3Clock.propTypes = {
  clockRadius: PropTypes.number,
  clockPadding: PropTypes.number,
  minuteHandBalance: PropTypes.number,
  minuteTickLength: PropTypes.number,
  hourTickLength: PropTypes.number,
  minuteLabelYOffset: PropTypes.number,
  hourLabelYOffset: PropTypes.number,
  showHourLabel: PropTypes.bool,
  showMinuteLabel: PropTypes.bool,
  showHourTick: PropTypes.bool,
  showMinuteTick: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  hours: PropTypes.bool,
  clockBg: PropTypes.string,
};

D3Clock.defaultProps = {
  value: 15,
  min: 0,
  max: Infinity,
  clockRadius: 200,
  clockPadding: 50,
  minuteHandBalance: 30,
  minuteTickLength: 10,
  hourTickLength: 18,
  minuteLabelYOffset: 5,
  hourLabelYOffset: 7,
  clockBg: 'white',
  // showHourTick: true,
  // showMinuteTick: true,
  // showHourLabel: true,
  // showMinuteLabel: true,
};

export default D3Clock;
