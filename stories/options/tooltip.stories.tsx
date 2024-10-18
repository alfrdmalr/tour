import * as React from 'react';
import { text, withKnobs } from '@storybook/addon-knobs';

import { playgroundSetup, primarySteps } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';

const playgroundDecorator = (storyFunction: () => Node) => (
  <>
    {playgroundSetup({
      buttonText: 'Click Me',
      onButtonClick: () => alert('Thanks!'),
    })}
    {storyFunction()}
  </>
);

export default {
  title: 'Walktour|Options/Tooltip Content',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};

export const buttonLabels = () => (
  <Walktour
    steps={primarySteps()}
    nextLabel={text('nextLabel', 'next')}
    prevLabel={text('prevLabel', 'prev')}
    closeLabel={text('closeLabel', 'close')}
  />
);
