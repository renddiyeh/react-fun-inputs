import React, { Component } from 'react';
import PropTypes from 'prop-types';
import random from 'lodash/random';
import range from 'lodash/range';

import Box from '../components/Box';

import radarChart from './radar';

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

class Radar extends Component {
  componentDidMount() {
    const { data } = this.props;
    console.log(data);
    radarChart.draw(this.container, data);
  }

  render() {
    const { data, ...props } = this.props;
    console.log(data);
    return (
      <Box align="center" {...props}>
        <StyledContainer innerRef={(ref) => { this.container = ref; }} />
      </Box>
    );
  }
}

Radar.propTypes = {
  data: PropTypes.shape({
    group: PropTypes.string,
    axis: PropTypes.string,
    value: PropTypes.number,
  }),
};

Radar.defaultProps = {
  data: range(5).map((d) => ({ group: 'You', axis: `Axis ${d}`, value: random(5) })),
};

export default Radar;
