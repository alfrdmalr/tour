import * as React from 'react';
import {
  boolean,
  number,
  optionsKnob,
  withKnobs,
} from '@storybook/addon-knobs';

import { Walktour } from '../../src/components/Walktour';
import { CardinalOrientation } from '../../src/utils/positioning';
import { singleTargetPlayground, singleTargetSteps } from '../utils/setup';
import { SingleStepTour } from '../utils/wrappers';

//TODO abstract out
const playgroundDecorator = (storyFunction: () => Node) => (
  <>
    {singleTargetPlayground()}
    {storyFunction()}
  </>
);

const options = {
  'CardinalOrientation.CENTER': [CardinalOrientation.CENTER],
  'CardinalOrientation.EAST': [CardinalOrientation.EAST],
  'CardinalOrientation.WEST': [CardinalOrientation.WEST],
  'CardinalOrientation.NORTH': [CardinalOrientation.NORTH],
  'CardinalOrientation.SOUTH': [CardinalOrientation.SOUTH],
  'CardinalOrientation.EASTNORTH': [CardinalOrientation.EASTNORTH],
  'CardinalOrientation.EASTSOUTH': [CardinalOrientation.EASTSOUTH],
  'CardinalOrientation.WESTNORTH': [CardinalOrientation.WESTNORTH],
  'CardinalOrientation.WESTSOUTH': [CardinalOrientation.WESTSOUTH],
  'CardinalOrientation.NORTHWEST': [CardinalOrientation.NORTHWEST],
  'CardinalOrientation.NORTHEAST': [CardinalOrientation.NORTHEAST],
  'CardinalOrientation.SOUTHWEST': [CardinalOrientation.SOUTHWEST],
  'CardinalOrientation.SOUTHEAST': [CardinalOrientation.SOUTHEAST],
  Auto: undefined as [CardinalOrientation],
};

const orientationKnob = () =>
  optionsKnob('orientationPreferences', options, undefined, {
    display: 'select',
  });

export const orientationPreferences = () => (
  <SingleStepTour
    steps={singleTargetSteps(
      `Specify the tooltip's position using the 'orientationPreferences' dropdown in the Knobs tab.`,
      'Orientation Preferences'
    )}
    orientationPreferences={orientationKnob()}
    disableCloseOnClick
  />
);

export const spacing = () => (
  <SingleStepTour
    steps={singleTargetSteps(
      'Adjust the spacing of the tooltip via the Knobs tab.',
      'Spacing Options'
    )}
    disableCloseOnClick
    maskPadding={number('maskPadding', 5)}
    tooltipSeparation={number('tooltipSeparation', 10)}
    orientationPreferences={orientationKnob()}
    disableMask={boolean('disableMask', false)}
  />
);

export const missingTarget = () => (
  <SingleStepTour
    steps={[
      {
        selector: null,
        title: 'Missing Target',
        description:
          'The tour tooltip will center itself in the viewport if the target cannot be found.',
      },
    ]}
    disableCloseOnClick
  />
);

export default {
  title: 'Walktour|Options/Positioning',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};
