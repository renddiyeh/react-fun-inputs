import React from 'react';
import styled from 'styled-components';
import tag from 'clean-tag';
import {
  width,
  height,
  space,
  color,
  flex,
  alignSelf,
  position,
  zIndex,
  top,
  right,
  bottom,
  left,
  textAlign,
  fontSize,
} from 'styled-system';

const Box = styled(tag)`
  ${width}
  ${height}
  ${space}
  ${color}
  ${flex}
  ${alignSelf}
  ${position}
  ${zIndex}
  ${top}
  ${right}
  ${bottom}
  ${left}
  ${textAlign}
  ${fontSize}
`;

Box.relative = props => <Box {...props} position="relative" />;
Box.absolute = props => <Box {...props} position="absolute" />;
Box.fixed = props => <Box {...props} position="fixed" />;

export default Box;
