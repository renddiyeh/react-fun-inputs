var _templateObject = _taggedTemplateLiteral(['\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n'], ['\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import React from 'react';
import styled from 'styled-components';
import tag from 'clean-tag';
import { width, height, space, color, flex, alignSelf, position, zIndex, top, right, bottom, left, textAlign, fontSize } from 'styled-system';

var Box = styled(tag)(_templateObject, width, height, space, color, flex, alignSelf, position, zIndex, top, right, bottom, left, textAlign, fontSize);

Box.relative = function (props) {
  return React.createElement(Box, Object.assign({}, props, { position: 'relative' }));
};
Box.absolute = function (props) {
  return React.createElement(Box, Object.assign({}, props, { position: 'absolute' }));
};
Box.fixed = function (props) {
  return React.createElement(Box, Object.assign({}, props, { position: 'fixed' }));
};

export default Box;