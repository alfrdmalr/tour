import * as React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { playgroundSetup, primarySteps } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';
import { buttonStepIndex } from '../utils/setup';

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
  title: 'Walktour|Options/Interaction',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};

export const all = () => (
  <Walktour
    steps={primarySteps()}
    disableCloseOnClick={boolean('disableCloseOnClick', true)}
    disableMaskInteraction={boolean('disableMaskInteraction', true)}
    disableNext={boolean('disableNext', false)}
    disablePrev={boolean('disablePrev', false)}
    disableClose={boolean('disableClose', true)}
  />
);

export const disableCloseOnClick = () => (
  <Walktour
    initialStepIndex={buttonStepIndex}
    steps={primarySteps()}
    disableCloseOnClick={boolean('disableCloseOnClick', true)}
  />
);

export const disableMaskInteraction = () => (
  <Walktour
    initialStepIndex={buttonStepIndex}
    steps={primarySteps()}
    disableMaskInteraction={boolean('disableMaskInteraction', true)}
  />
);

export const disableActions = () => (
  <Walktour
    steps={primarySteps()}
    disableNext={boolean('disableNext', false)}
    disablePrev={boolean('disablePrev', false)}
    disableClose={boolean('disableClose', true)}
  />
);
