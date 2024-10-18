import * as React from 'react';
import {
  boolean,
  number,
  optionsKnob,
  text,
  withKnobs,
} from '@storybook/addon-knobs';

import { playgroundSetup, primarySteps } from '../../demo/setup';
import { Walktour } from '../../src/components/Walktour';
import { CardinalOrientation } from '../../src/utils/positioning';

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
  title: 'Walktour|Options',
  component: Walktour,
  decorators: [withKnobs, playgroundDecorator],
};

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

export const all = () => (
  <Walktour
    steps={primarySteps()}
    disableCloseOnClick={boolean('disableCloseOnClick', true)}
    disableMaskInteraction={boolean('disableMaskInteraction', true)}
    disableNext={boolean('disableNext', false)}
    disablePrev={boolean('disablePrev', false)}
    disableClose={boolean('disableClose', true)}
    orientationPreferences={orientationKnob()}
    maskPadding={number('maskPadding', 5)}
    tooltipSeparation={number('tooltipSeparation', 10)}
    nextLabel={text('nextLabel', 'next')}
    prevLabel={text('prevLabel', 'prev')}
    closeLabel={text('closeLabel', 'close')}
    disableMask={boolean('disableMask', true)}
    disableAutoScroll={boolean('disableAutoScroll', true)}
    disableSmoothScroll={boolean('disableSmoothScroll', true)}
    movingTarget={boolean('movingTarget', false)}
  />
);
