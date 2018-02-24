import styled from 'styled-components';
import tag from 'clean-tag';
import {
  width,
  space,
  fontSize,
} from 'styled-system';

const Input = styled(tag.input)`
  ${width}
  ${space}
  ${fontSize}
`;

Input.defaultProps = {
  w: 1,
  p: '0.5rem',
  my: '1rem',
  f: '1.25em',
};

export default Input;
