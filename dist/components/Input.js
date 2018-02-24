var _templateObject = _taggedTemplateLiteral(['\n  ', '\n  ', '\n  ', '\n'], ['\n  ', '\n  ', '\n  ', '\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import styled from 'styled-components';
import tag from 'clean-tag';
import { width, space, fontSize } from 'styled-system';

var Input = styled(tag.input)(_templateObject, width, space, fontSize);

Input.defaultProps = {
  w: 1,
  p: '0.5rem',
  my: '1rem',
  f: '1.25em'
};

export default Input;