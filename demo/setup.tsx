import * as React from 'react';

import { Step, WalktourLogic } from '../src/components/Walktour';
import { CardinalOrientation } from '../src/utils/positioning';

interface demoOptions {
  buttonText: string;
  onButtonClick?: () => void;
}

export const playgroundSetup = (args: demoOptions) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: 1800,
    top: 1800,
    height: 600,
    width: 600,
    overflow: 'auto',
    padding: '2rem',
  };
  const oneStyle: React.CSSProperties = {
    background: 'grey',
    width: 200,
    height: 100,
  };
  const twoStyle: React.CSSProperties = {
    background: 'cornflowerblue',
    width: 100,
    height: 200,
    left: 300,
    top: 300,
    position: 'absolute',
  };
  const threeStyle: React.CSSProperties = {
    background: 'magenta',
    width: 600,
    height: 100,
    left: 900,
    top: 15,
    position: 'absolute',
  };
  const fourStyle: React.CSSProperties = {
    background: 'orange',
    width: 200,
    height: 100,
    left: 1120,
    top: 580,
    position: 'absolute',
  };
  const fiveStyle: React.CSSProperties = {
    position: 'absolute',
    top: '350px',
    left: '650px',
    cursor: 'pointer',
  };
  const sixStyle: React.CSSProperties = {
    background: 'aquamarine',
    width: 200,
    height: 100,
    left: 450,
    top: 450,
    position: 'absolute',
  };
  const sevenStyle: React.CSSProperties = {
    background: 'linear-gradient(to right, red, white, blue)',
    width: 200,
    height: 100,
    left: 169,
    top: 1776,
    position: 'absolute',
  };
  const eightStyle: React.CSSProperties = {
    background: 'transparent',
    width: 200,
    height: 100,
    left: 10,
    top: 650,
    position: 'absolute',
    border: '5px dotted black',
    borderRadius: '5px',
  };
  const formStyle: React.CSSProperties = {
    position: 'absolute',
    left: 450,
    top: 200,
    border: 'solid black 1px',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  };
  return (
    <>
      <div id={'one'} style={oneStyle} />
      <div id={'two'} style={twoStyle} />
      <div id={'three'} style={threeStyle} />
      <div className={'four'} style={fourStyle} />
      <button style={fiveStyle} id="five" onClick={args.onButtonClick}>
        {args.buttonText}
      </button>
      <div id="nine" tabIndex={0} style={formStyle}>
        <button onClick={() => alert('No mouse required')}>
          Focusable Button
        </button>
        <input type="text" placeholder="focusable text box" />
        <button disabled onClick={() => alert('disabled')}>
          Disabled (not focusable)
        </button>
      </div>
      <div id="six" style={sixStyle} />
      <div id="seven" style={sevenStyle} />
      <div id="eight" style={eightStyle} />

      <div style={containerStyle} id="demo-container">
        <div id="oneTwo" style={oneStyle} />
        <div id="twoTwo" style={{ ...twoStyle }} />
        <div id="threeTwo" style={threeStyle} />
        <button
          id={'ten'}
          style={{ ...fiveStyle, width: '5rem' }}
          onClick={() =>
            console.log(
              "I'm just a normal button. All I do is print this message - the tour handles the rest!"
            )
          }
        >
          Click me to go to the next step!
        </button>
      </div>
    </>
  );
};

interface CustomTooltipProps {
  close: () => void;
  description: string;
}

function CustomTooltip(props: CustomTooltipProps) {
  const style: React.CSSProperties = {
    backgroundColor: 'darkslategrey',
    color: 'cornsilk',
    fontFamily: 'Consolas, serif',
    border: '1px solid cornsilk',
    maxWidth: 300,
    padding: 10,
    minWidth: 320,
  };
  return (
    <div style={style}>
      <p>
        You can also render your own custom components instead of the default
        tooltip.
      </p>

      <p>
        They'll have access to the same control functions as the normal tooltip.
      </p>

      <p>
        More info about customizability and usage{' '}
        <a
          style={{ color: 'cyan' }}
          href="http://www.github.com/alfrdmalr/walktour"
        >
          on Github.
        </a>
      </p>
      <button onClick={props.close}>close</button>
    </div>
  );
}

export const primarySteps = (): Step[] => [
  {
    selector: '#one',
    title: 'Guided Tour Component',
    description: 'Welcome to the tour!',
  },
  {
    selector: '#two',
    title: 'Keyboard Navigation',
    description: 'Use the arrow keys or tab to a specific button',
  },
  {
    selector: '#nine',
    title: 'Accessibility!',
    description:
      'The tooltip traps focus for keyboard users. The trap includes the target element(s)!',
  },
  {
    selector: '.four',
    title: 'Full CSS Selector Support',
    description: 'Any valid query selector works for targeting elements',
  },
  {
    selector: '#five',
    title: 'Interact with the highlighted element',
    description: 'click the button to see for yourself!',
  },
  {
    selector: '#eight',
    title: 'Supply Custom HTML Content',
    description: null,
    customDescriptionRenderer: () => (
      <>
        <h1>H1 Element</h1>
        <p>Paragraph Element</p>
        <input type="text" placeholder={'text input element'} />
      </>
    ),
  },
  {
    selector: null,
    title: 'Access the Tour API...',
    description: 'return the to first step',
    customDescriptionRenderer: (description: string, logic: WalktourLogic) => (
      <div>
        ...from inside your custom content
        <button onClick={() => logic.goToStep(0)}>{description}</button>
      </div>
    ),
  },
  {
    selector: '#three',
    title: 'Smart Positioning',
    description:
      'The tooltip is automatically positioned within view. Try resizing the window!',
  },
  {
    selector: '#six',
    title: 'Explicit Positioning',
    description: 'East!',
    orientationPreferences: [CardinalOrientation.EAST],
  },
  {
    selector: '#six',
    title: 'Explicit Positioning',
    description: 'South!',
    orientationPreferences: [CardinalOrientation.SOUTH],
  },
  {
    selector: '#six',
    title: 'Get More Specific!',
    description: 'North with West alignment!',
    orientationPreferences: [CardinalOrientation.NORTHWEST],
  },
  {
    selector: '#six',
    title: 'Get More Specific!',
    description: 'West with North alignment!',
    orientationPreferences: [CardinalOrientation.WESTNORTH],
  },
  {
    selector: '#seven',
    title: 'Scrolling',
    description: 'Offscreen elements can be automatically scrolled into view',
  },
  {
    selector: '.four',
    title: 'Corners',
    description: 'Mask with rounded corners!',
    maskRadius: 20,
    maskPadding: 15,
  },
  {
    selector: '#six',
    title: null,
    description: null,
    customTooltipRenderer: (logic: WalktourLogic) => (
      <CustomTooltip {...logic} {...logic.stepContent} />
    ),
  },
];

export const primaryIntoSecondary = (): Step[] => [
  ...primarySteps(),
  {
    selector: '#demo-container',
    title: 'Encapsulated Tours',
    description: 'Not only can you have multiple tours on a page...',
  },
];

export const secondarySteps = (): Step[] => [
  { selector: '#oneTwo', description: '...you can also have scoped tours' },
  {
    selector: 'fakeselector',
    description:
      'The tour component will automatically find the nearest suitable ancestor to hold it',
  },
  {
    selector: '#threeTwo',
    title: 'Smart Masking!',
    description:
      'The overlay will be constrained by this ancestor container, and scrolling works within the component',
  },
  {
    selector: '#ten',
    title: 'Advance Tour With Highlighted Elements',
    description:
      'In addition to the usual methods, the tour will proceed to the next step if the target button is clicked.',
    nextOnTargetClick: true,
    validateNextOnTargetClick: () => {
      alert(
        "You might want to validate some data before actually proceeding to the next step. For the sake of example, we'll just validate when 'OK' is pressed."
      );
      return Promise.resolve(true);
    },
    orientationPreferences: [CardinalOrientation.EAST],
  },
  {
    selector: '#ten',
    title: 'Conditional Next Handling',
    description:
      "The tour can behave differently depending on where 'next' gets invoked. For instance, clicking 'next' on this step will move the tour back two steps. To continue forward, click the button.",
    customNextFunc: (logic: WalktourLogic, fromTarget: boolean) => {
      fromTarget ? logic.next() : logic.goToStep(logic.stepIndex - 2);
    },
    nextOnTargetClick: true,
    orientationPreferences: [CardinalOrientation.NORTH],
  },
  {
    selector: '#three',
    title: 'Target Foreign Elements',
    disableAutoScroll: true,
    description:
      "This step is targeting the very first box on the page. It's way out of the scope of this tour, so it usually doesn't make sense to do this.",
    allowForeignTarget: true,
  },
  {
    selector: '#walktour-tooltip-container-1',
    title: 'Target Foreign Elements',
    disableAutoScroll: true,
    description:
      "In some cases, the foreign element might be close enough to point to! We won't be able to highlight it using the mask, but we can still interact with it as normal. If it's still around, this step should be targeting the main tour's tooltip.",
    allowForeignTarget: true,
    movingTarget: true,
  },
];
