import {
  alignItems,
  alignContent,
  justifyContent,
  flexWrap,
  flexDirection,
} from 'styled-system';

import Box from './Box';

export default Box.extend`
  display: flex;
  ${alignItems}
  ${alignContent}
  ${justifyContent}
  ${flexWrap}
  ${flexDirection}
`;
