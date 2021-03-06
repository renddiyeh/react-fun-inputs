import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Clock from '../src/Clock';
import Pie from '../src/Pie';
import D3Clock from '../src/D3Clock';
import Radar from '../src/Radar';

storiesOf('Clock', module)
  .add('Clock', () => <Clock w="20em" onChange={action('onChange')} />)
  .add('D3Clock', () => <D3Clock onChange={action('onChange')} />)
  .add('Clock (Hour)', () => <Clock hours w="20em" onChange={action('onChange')} />)
  .add('Clock with min and max', () => <Clock min={30} max={60} w="20em" onChange={action('onChange')} />)
  .add('Clock with min and max (Hour)', () => <Clock min={0} max={9} hours w="20em" onChange={action('onChange')} />);

storiesOf('Pie', module)
  .add('Pie', () => <Pie w="20em" onChange={action('onChange')} />);

storiesOf('Radar', module)
  .add('Radar', () => <Radar />);
