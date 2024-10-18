import * as React from 'react';
import { action } from '@storybook/addon-actions';

import { Walktour, WalktourProps } from '../../src/components/Walktour';

export const DummyTour = (props: WalktourProps) => (
  <Walktour
    customNextFunc={action('next')}
    customPrevFunc={action('prev')}
    customCloseFunc={action('close')}
    {...props}
  />
);

// expects props.steps to be only 1 step long
export const SingleStepTour = (props: WalktourProps) => {
  const newSteps = [
    { selector: 'dummystep1', description: 'blah' },
    ...props.steps,
    { selector: 'dummystep3', description: 'blah' },
  ];

  return DummyTour({ ...props, steps: newSteps, initialStepIndex: 1 });
};
