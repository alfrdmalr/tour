import * as React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import { Walktour } from '../../src/components/Walktour';
import { singleTargetPlayground, singleTargetSteps } from '../utils/setup';
import { SingleStepTour } from '../utils/wrappers';

//TODO abstract out
const playgroundDecorator = (storyFunction: () => Node) => (
  <>
    {singleTargetPlayground()}
    {storyFunction()}
  </>
);

export const all = () => (
  <SingleStepTour
    steps={singleTargetSteps(
      'Adjust the visibility options from the Knobs tab.'
    )}
    isOpen={boolean('isOpen', true)}
    disableMask={boolean('disableMask', true)}
  />
);

export const isOpen = () => (
  <SingleStepTour
    steps={singleTargetSteps(
      "Toggle the tour by changing 'isOpen' in the Knobs tab"
    )}
    isOpen={boolean('isOpen', true)}
  />
);

export const disableMask = () => (
  <SingleStepTour
    steps={singleTargetSteps(
      "Toggle the mask by changing the 'disableMask' in the Knobs tab"
    )}
    disableMask={boolean('disableMask', true)}
  />
);

export default {
  title: 'Walktour|Options/Visibility',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};
