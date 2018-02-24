var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n'], ['\n  display: flex;\n  ', '\n  ', '\n  ', '\n  ', '\n  ', '\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import { alignItems, alignContent, justifyContent, flexWrap, flexDirection } from 'styled-system';

import Box from './Box';

export default Box.extend(_templateObject, alignItems, alignContent, justifyContent, flexWrap, flexDirection);