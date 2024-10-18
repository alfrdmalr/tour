import * as React from 'react';
import { actions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { playgroundSetup } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';
import { scrollingSteps } from '../utils/setup';

//TODO abstract out
const playgroundDecorator = (storyFunction: () => Node) => (
  <>
    {playgroundSetup({
      buttonText: 'Click Me',
      onButtonClick: () => 'Thanks!',
    })}
    {storyFunction()}
  </>
);

export default {
  title: 'Walktour|Options/Scrolling',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};

export const all = () => (
  <Walktour
    customCloseFunc={() => actions('close')}
    steps={scrollingSteps(
      'Adjust the scrolling-related options from the Knobs tab to see how they might interact.'
    )}
    disableAutoScroll={boolean('disableAutoScroll', false)}
    disableSmoothScroll={boolean('disableSmoothScroll', false)}
  />
);

export const disableAutoScroll = () => (
  <Walktour
    customCloseFunc={() => actions('close')}
    steps={scrollingSteps(
      "Disable automatic scrolling by changing the value of 'disableAutoScroll' in the Knobs tab."
    )}
    disableAutoScroll={boolean('disableAutoScroll', true)}
  />
);

export const disableSmoothScroll = () => (
  <Walktour
    customCloseFunc={() => actions('close')}
    steps={scrollingSteps(
      "Disable smooth scrolling by changing the value of 'disableSmoothScroll' from the Knobs tab."
    )}
    disableSmoothScroll={boolean('disableSmoothScroll', true)}
  />
);
