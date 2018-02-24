import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Clock from '../src/Clock';

storiesOf('Clock', module)
  .add('Clock', () => <Clock w="20em" onChange={action('onChange')} />)
  .add('Clock (Hour)', () => <Clock hours w="20em" onChange={action('onChange')} />)
  .add('Clock with min and max', () => <Clock min={30} max={60} w="20em" onChange={action('onChange')} />)
  .add('Clock with min and max (Hour)', () => <Clock min={0} max={9} hours w="20em" onChange={action('onChange')} />);
