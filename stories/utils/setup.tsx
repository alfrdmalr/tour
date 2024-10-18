import * as React from 'react';

import { Step } from '../../src/components/Walktour';

export const singleTargetPlayground = () => {
  const oneStyle: React.CSSProperties = {
    background: 'maroon',
    width: 100,
    height: 100,
    position: 'absolute',
    left: '40%',
    top: '50%',
  };
  return (
    <>
      <div id={'one'} style={oneStyle} />
    </>
  );
};

export const singleTargetSteps = (
  description: string,
  title?: string
): Step[] => [{ selector: '#one', title: title, description: description }];
export const scrollingSteps = (description: string): Step[] => [
  { selector: '#two', description: description },
  { selector: '#seven', description: description },
];

export const buttonStepIndex: number = 4; // this should align with the step in primarySteps that focuses the button
