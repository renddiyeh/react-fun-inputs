import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { select, event } from 'd3-selection';
import { pie, arc } from 'd3-shape';
import { range } from 'd3-array';
import { drag } from 'd3-drag';

import openColor from 'open-color/open-color.json';

import Box from './components/Box';
import DragToRotate, { radianToDegree } from './utils/DragToRotate';

const StyledContainer = Box.extend`
  .pie-handle {
    cursor: pointer;
    transition: opacity 0.2s ease;
    &:hover {
      opacity: 0.2;
    }
  }

  .pie-label {
    pointer-events: none;
  }
`;

const canDrag = (d, i) => i > 0;

class Pie extends Component {
  constructor(props) {
    super(props);
    this.values = props.values;
  }

  componentDidMount() {
    this.svg = select(this.container).append('svg');
    this.setContants();
    this.drawPie();
  }

  shouldComponentUpdate = false

  setContants = () => {
    this.width = this.container.getBoundingClientRect().width;
    this.height = this.width;
    this.svg
      .attr('width', this.width)
      .attr('height', this.width);
    this.radius = this.width / 2;
    const gap = this.radius / 10;
    this.base = this.svg.append('g').attr('transform', `translate(${this.radius},${this.radius})`);
    this.pie = pie().sort(null);
    this.outerRadius = this.radius - gap;
    this.path = arc()
      .outerRadius(this.outerRadius)
      .innerRadius(0);

    this.label = arc()
      .outerRadius(this.radius - (gap * 4))
      .innerRadius(this.radius - (gap * 4));

    this.dragging = new DragToRotate([this.radius, this.radius]);
  }

  updateValues = (index, delta) => {
    const { onChange } = this.props;
    const newValues = this.values.map((v, i) => {
      if (i === index - 1) {
        return v + delta;
      }
      if (i === index) {
        return v - delta;
      }
      return v;
    });
    if (newValues.every((n) => n > 0)) {
      this.values = newValues;
      if (onChange) onChange(this.values);
      this.updatePie();
    }
  }

  updatePie = () => {
    const newPie = this.pie(this.values);
    this.piePath
      .data(newPie)
      .attr('d', this.path);
    this.pieText
      .data(newPie)
      .attr('transform', (d) => `translate(${this.label.centroid(d)})`);
    this.pieHandle
      .data(newPie)
      .filter((d, i) => i > 0)
      .attr('transform', (d) => `rotate(${radianToDegree(d.startAngle)})`);
  }

  drawPie = () => {
    const { labels, colors } = this.props;
    const arcGroup = this.base.selectAll('.arc')
      .data(this.pie(this.values))
      .enter()
      .append('g')
      .attr('class', 'arc');

    this.piePath = arcGroup.append('path')
      .attr('d', (d) => this.path(d))
      .attr('stroke', 'white')
      .attr('fill', (d, i) => colors[i]);

    this.pieText = arcGroup.append('text')
      .attr('class', 'pie-label')
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${this.label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d, i) => labels[i]);

    this.pieHandle = arcGroup.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', -this.outerRadius)
      .attr('opacity', 0.1)
      .attr('class', (d, i) => i > 0 && 'pie-handle')
      .attr('stroke', 'currentColor')
      .attr('stroke-width', this.radius / 10)
      .attr('transform', (d) => `rotate(${radianToDegree(d.startAngle)})`)
      .call(drag().filter(canDrag).container(this.container)
        .on('end', this.handleDragEnd)
        .on('drag', this.handleDrag));
  }

  handleDragEnd = () => {
    this.dragging.clear();
  }

  handleDrag = () => {
    const { x, y, subject: { index } } = event;
    const delta = this.dragging.parseDrag([x, y]);
    this.updateValues(index, delta * 12);
  }

  render() {
    const {
      values,
      colors,
      labels,
      onChange,
      ...props
    } = this.props;
    return (
      <Box align="center" {...props}>
        <StyledContainer innerRef={(ref) => { this.container = ref; }} />
      </Box>
    );
  }
}

Pie.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
};

Pie.defaultProps = {
  values: Array(5).fill(12 / 5),
  colors: range(3, 8).reverse().map((i) => openColor.gray[i]),
  labels: ['section1', 'section2', 'section3', 'section4', 'section5'],
};

export default Pie;
