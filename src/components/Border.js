import {
  border,
  borderTop,
  borderRight,
  borderBottom ,
  borderLeft,
  borderColor,
  borderRadius,
} from 'styled-system';

import Box from './Box';

export default Box.extend`
  ${border}
  ${borderTop}
  ${borderRight}
  ${borderBottom }
  ${borderLeft}
  ${borderColor}
  ${borderRadius}
`;
